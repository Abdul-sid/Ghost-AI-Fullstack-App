import { readJsonBody } from "@/lib/api-request";
import { errorResponse, unauthenticatedResponse } from "@/lib/api-response";
import {
  getCurrentUserId,
  isUniqueConstraintError,
} from "@/lib/project-access";
import { listOwnedProjects } from "@/lib/project-data";
import { parseCreateProjectInput } from "@/lib/project-input";
import { prisma } from "@/lib/prisma";

/** Lists the projects owned by the signed-in user, newest first. */
export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return unauthenticatedResponse();
  }

  const projects = await listOwnedProjects(userId);

  return Response.json({ projects });
}

/** Creates a project owned by the signed-in user. */
export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return unauthenticatedResponse();
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return errorResponse(400, body.error);
  }

  const input = parseCreateProjectInput(body.value);

  if (!input.success) {
    return errorResponse(400, input.error);
  }

  try {
    // A supplied `id` is the project's room ID; without one the schema's
    // `@default(cuid())` applies.
    const project = await prisma.project.create({
      data: { id: input.data.id, ownerId: userId, name: input.data.name },
    });

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return errorResponse(409, "A project with this ID already exists.");
    }

    throw error;
  }
}
