import { mockVideos } from "@/data/mock/videos";
import type { Video, VideoQuestion } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const videos = [...mockVideos];

export async function getVideosByModule(moduleId: string): Promise<Video[]> {
  await sleep(300);
  return videos.filter((v) => v.moduleId === moduleId).sort((a, b) => a.order - b.order);
}

export async function getVideo(id: string): Promise<Video | null> {
  await sleep(200);
  return videos.find((v) => v.id === id) || null;
}

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

export async function updateVideo(id: string, data: Partial<Video>): Promise<Video> {
  await sleep(300);
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Vidéo non trouvée");
  videos[idx] = { ...videos[idx], ...data };
  return videos[idx];
}

export async function deleteVideo(id: string): Promise<void> {
  await sleep(300);
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Vidéo non trouvée");
  videos.splice(idx, 1);
}

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

export async function deleteVideoQuestion(videoId: string, questionId: string): Promise<void> {
  await sleep(200);
  const video = videos.find((v) => v.id === videoId);
  if (!video) throw new Error("Vidéo non trouvée");
  video.questions = video.questions.filter((q) => q.id !== questionId);
}

export async function markVideoCompleted(videoId: string, learnerId: string): Promise<void> {
  await sleep(200);
  // Mock: would write to a video_progress table
}
