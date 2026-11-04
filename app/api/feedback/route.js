import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const feedback = body.feedback?.trim();

    if (!feedback) {
      return Response.json(
        { error: "Feedback cannot be empty." },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Portfolio Feedback <onboarding@resend.dev>",
      to: [process.env.FEEDBACK_EMAIL],
      subject: "New Portfolio Feedback",
      text: feedback,
    });

    if (error) {
      console.error("Resend error:", error);

      return Response.json(
        { error: "Failed to send feedback email." },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Feedback sent successfully.",
        id: data.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Feedback API error:", error);

    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
