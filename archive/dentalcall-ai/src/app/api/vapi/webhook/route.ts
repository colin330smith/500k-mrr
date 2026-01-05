import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface VapiWebhookPayload {
  message: {
    type: string;
    call?: {
      id: string;
      orgId: string;
      createdAt: string;
      endedAt?: string;
      cost?: number;
      customer?: {
        number: string;
      };
      transcript?: string;
      summary?: string;
      recordingUrl?: string;
      analysis?: {
        successEvaluation?: string;
        summary?: string;
        structuredData?: {
          appointmentBooked?: boolean;
          appointmentTime?: string;
          patientName?: string;
          patientPhone?: string;
          callOutcome?: string;
        };
      };
    };
    endedReason?: string;
    assistant?: {
      id: string;
    };
  };
}

export async function POST(request: Request) {
  try {
    const payload: VapiWebhookPayload = await request.json();
    const { message } = payload;

    console.log(`Vapi webhook received: ${message.type}`);

    switch (message.type) {
      case "end-of-call-report": {
        const call = message.call;
        if (!call) break;

        // Find the user by their Vapi assistant ID
        const { data: voiceAgent } = await supabaseAdmin
          .from("voice_agents")
          .select("user_id")
          .eq("vapi_assistant_id", message.assistant?.id)
          .single();

        if (!voiceAgent) {
          console.error("Voice agent not found for assistant:", message.assistant?.id);
          break;
        }

        // Calculate duration
        const startTime = new Date(call.createdAt);
        const endTime = call.endedAt ? new Date(call.endedAt) : new Date();
        const durationSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

        // Determine outcome from analysis
        let outcome = "inquiry";
        const structuredData = call.analysis?.structuredData;
        if (structuredData?.appointmentBooked) {
          outcome = "booked";
        } else if (structuredData?.callOutcome) {
          outcome = structuredData.callOutcome;
        }

        // Save call record
        const { data: savedCall, error: callError } = await supabaseAdmin
          .from("calls")
          .insert({
            user_id: voiceAgent.user_id,
            vapi_call_id: call.id,
            caller_phone: call.customer?.number,
            caller_name: structuredData?.patientName,
            duration_seconds: durationSeconds,
            outcome,
            transcript: call.transcript,
            summary: call.analysis?.summary || call.summary,
            recording_url: call.recordingUrl,
            cost_cents: Math.round((call.cost || 0) * 100),
            appointment_booked_at: structuredData?.appointmentTime
              ? new Date(structuredData.appointmentTime).toISOString()
              : null,
          })
          .select()
          .single();

        if (callError) {
          console.error("Error saving call:", callError);
        } else {
          console.log(`Call saved: ${savedCall.id}, outcome: ${outcome}`);

          // Create appointment if booked
          if (outcome === "booked" && structuredData?.appointmentTime) {
            await supabaseAdmin.from("appointments").insert({
              user_id: voiceAgent.user_id,
              call_id: savedCall.id,
              patient_name: structuredData.patientName || "Unknown",
              patient_phone: structuredData.patientPhone || call.customer?.number || "",
              scheduled_at: new Date(structuredData.appointmentTime).toISOString(),
              status: "scheduled",
            });
          }
        }
        break;
      }

      case "status-update": {
        // Handle call status updates (ringing, in-progress, ended)
        console.log("Call status update:", message);
        break;
      }

      case "transcript": {
        // Handle real-time transcript updates
        // Useful for live dashboards
        break;
      }

      case "function-call": {
        // Handle function calls from the AI
        // e.g., booking appointments, transferring calls
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Vapi webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Verify webhook signature (optional but recommended)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
