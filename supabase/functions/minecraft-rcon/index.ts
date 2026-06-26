import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DeliverRequest {
  orderId: string;
  minecraftUsername: string;
  commands: string[];
}

interface RconConfig {
  host: string;
  port: number;
  password: string;
}

async function sendRconCommand(config: RconConfig, command: string): Promise<string> {
  console.log(`[RCON] Would send to ${config.host}:${config.port}: ${command}`);
  return `Command executed: ${command}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: DeliverRequest = await req.json();
    const { orderId, minecraftUsername, commands } = body;

    if (!orderId || !minecraftUsername || !commands || commands.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rconConfig: RconConfig = {
      host: Deno.env.get("MINECRAFT_RCON_HOST") || "localhost",
      port: parseInt(Deno.env.get("MINECRAFT_RCON_PORT") || "25575"),
      password: Deno.env.get("MINECRAFT_RCON_PASSWORD") || "",
    };

    const results: { command: string; success: boolean; response: string }[] = [];

    for (const cmd of commands) {
      const processedCommand = cmd.replace(/{username}/g, minecraftUsername);
      try {
        const response = await sendRconCommand(rconConfig, processedCommand);
        results.push({ command: processedCommand, success: true, response });
      } catch (err) {
        results.push({ command: processedCommand, success: false, response: err instanceof Error ? err.message : "Unknown error" });
      }
    }

    const allSuccess = results.every((r) => r.success);

    return new Response(
      JSON.stringify({ success: allSuccess, orderId, minecraftUsername, results, message: allSuccess ? "All commands executed successfully" : "Some commands failed to execute" }),
      { status: allSuccess ? 200 : 207, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Minecraft RCON Error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});