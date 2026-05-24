import axios from 'axios';
import type { Project, Skill, Experience, ContactForm } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchFeaturedProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects/featured');
  return data;
}

export async function fetchSkills(): Promise<Skill[]> {
  const { data } = await api.get<Skill[]>('/skills');
  return data;
}

export async function fetchExperience(): Promise<Experience[]> {
  const { data } = await api.get<Experience[]>('/experience');
  return data;
}

export async function submitContact(form: ContactForm): Promise<void> {
  await api.post('/contact', form);
}

export default api;
