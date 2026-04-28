import { mockVideos } from "@/data/mock/videos";
import type { Video, VideoQuestion } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const videos = [...mockVideos];

/**
 * Recupere les videos d'un module, triees par ordre.
 *
 * @param moduleId - Identifiant du module
 * @returns Videos du module triees par `order`
 */
export async function getVideosByModule(moduleId: string): Promise<Video[]> {
  await sleep(300);
  return videos.filter((v) => v.moduleId === moduleId).sort((a, b) => a.order - b.order);
}

/**
 * Recupere une video par son identifiant.
 *
 * @param id - Identifiant de la video
 * @returns La video ou null si non trouvee
 */
export async function getVideo(id: string): Promise<Video | null> {
  await sleep(200);
  return videos.find((v) => v.id === id) || null;
}

/**
 * Cree une nouvelle video dans un module.
 *
 * @param data - Donnees de la video (sans id, createdAt, questions)
 * @returns La video creee avec son ID genere
 */
export async function createVideo(data: Omit<Video, "id" | "createdAt" | "questions">): Promise<Video> {
  await sleep(400);
  const newVideo: Video = {
    ...data,
    id: `video-${generateId()}`,
    questions: [],
    createdAt: new Date().toISOString(),
  };
  videos.push(newVideo);
  return newVideo;
}

/**
 * Met a jour une video existante.
 *
 * @param id - Identifiant de la video
 * @param data - Champs a modifier
 * @returns La video mise a jour
 * @throws Si la video n'existe pas
 */
export async function updateVideo(id: string, data: Partial<Video>): Promise<Video> {
  await sleep(300);
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Vidéo non trouvée");
  videos[idx] = { ...videos[idx], ...data };
  return videos[idx];
}

/**
 * Supprime une video par son identifiant.
 *
 * @param id - Identifiant de la video
 * @throws Si la video n'existe pas
 */
export async function deleteVideo(id: string): Promise<void> {
  await sleep(300);
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Vidéo non trouvée");
  videos.splice(idx, 1);
}

/**
 * Ajoute une question overlay a une video (declenchee a un timestamp).
 *
 * @param videoId - Identifiant de la video
 * @param data - Donnees de la question (sans id ni videoId)
 * @returns La question creee
 * @throws Si la video n'existe pas
 */
export async function addVideoQuestion(videoId: string, data: Omit<VideoQuestion, "id" | "videoId">): Promise<VideoQuestion> {
  await sleep(300);
  const video = videos.find((v) => v.id === videoId);
  if (!video) throw new Error("Vidéo non trouvée");
  const question: VideoQuestion = {
    ...data,
    id: `vq-${generateId()}`,
    videoId,
  };
  video.questions.push(question);
  return question;
}

/**
 * Supprime une question overlay d'une video.
 *
 * @param videoId - Identifiant de la video
 * @param questionId - Identifiant de la question a supprimer
 * @throws Si la video n'existe pas
 */
export async function deleteVideoQuestion(videoId: string, questionId: string): Promise<void> {
  await sleep(200);
  const video = videos.find((v) => v.id === videoId);
  if (!video) throw new Error("Vidéo non trouvée");
  video.questions = video.questions.filter((q) => q.id !== questionId);
}

/**
 * Marque une video comme visionnee par un apprenant.
 *
 * @param videoId - Identifiant de la video
 * @param learnerId - Identifiant de l'apprenant
 */
export async function markVideoCompleted(_videoId: string, _learnerId: string): Promise<void> {
  await sleep(200);
  // Mock: would write to a video_progress table
}
