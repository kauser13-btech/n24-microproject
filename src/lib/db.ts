import fs from 'fs/promises';
import path from 'path';
import { ElectionCenter, Candidate, Sign, User } from './types';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const CENTERS_FILE = path.join(DATA_DIR, 'centers.json');
const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
const SIGNS_FILE = path.join(DATA_DIR, 'signs.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function readJson<T>(filePath: string): Promise<T[]> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as any).code === 'ENOENT') return [];
        throw error;
    }
}

async function writeJson<T>(filePath: string, data: T[]): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// CENTERS
export async function getCenters(): Promise<ElectionCenter[]> {
    await delay(100);
    return readJson<ElectionCenter>(CENTERS_FILE);
}

export async function getCenterById(id: string): Promise<ElectionCenter | undefined> {
    const centers = await getCenters();
    return centers.find((c) => String(c.id) === String(id));
}

export async function createCenter(center: Omit<ElectionCenter, 'id'>): Promise<ElectionCenter> {
    const centers = await getCenters();
    const newCenter = { ...center, id: crypto.randomUUID() };
    centers.push(newCenter);
    await writeJson(CENTERS_FILE, centers);
    return newCenter;
}

export async function updateCenter(id: string, data: Partial<ElectionCenter>): Promise<ElectionCenter | null> {
    const centers = await getCenters();
    const index = centers.findIndex((c) => String(c.id) === String(id));
    if (index === -1) return null;

    centers[index] = { ...centers[index], ...data };
    await writeJson(CENTERS_FILE, centers);
    return centers[index];
}

export async function deleteCenter(id: string): Promise<boolean> {
    const centers = await getCenters();
    const filtered = centers.filter((c) => String(c.id) !== String(id));
    if (filtered.length === centers.length) return false;

    await writeJson(CENTERS_FILE, filtered);
    // Also delete associated candidates? For now, let's keep it simple or cascade manually.
    // In a real DB, we'd have cascade delete.
    return true;
}

// CANDIDATES
export async function getCandidates(): Promise<Candidate[]> {
    await delay(100);
    return readJson<Candidate>(CANDIDATES_FILE);
}

export async function getCandidatesByCenter(centerId: string): Promise<Candidate[]> {
    const candidates = await getCandidates();
    return candidates.filter((c) => String(c.assignedCenterId) === String(centerId));
}

export async function createCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
    const candidates = await getCandidates();
    const newCandidate = { ...candidate, id: crypto.randomUUID() };
    candidates.push(newCandidate);
    await writeJson(CANDIDATES_FILE, candidates);
    return newCandidate;
}

export async function updateCandidate(id: string, data: Partial<Candidate>): Promise<Candidate | null> {
    const candidates = await getCandidates();
    const index = candidates.findIndex((c) => String(c.id) === String(id));
    if (index === -1) return null;

    candidates[index] = { ...candidates[index], ...data };
    await writeJson(CANDIDATES_FILE, candidates);
    return candidates[index];
}

export async function deleteCandidate(id: string): Promise<boolean> {
    const candidates = await getCandidates();
    const filtered = candidates.filter((c) => String(c.id) !== String(id));
    if (filtered.length === candidates.length) return false;

    await writeJson(CANDIDATES_FILE, filtered);
    return true;
}

// SIGNS
export async function getSigns(): Promise<Sign[]> {
    await delay(100);
    return readJson<Sign>(SIGNS_FILE);
}

export async function createSign(sign: Omit<Sign, 'id'>): Promise<Sign> {
    const signs = await getSigns();
    const newSign = { ...sign, id: crypto.randomUUID() };
    signs.push(newSign);
    await writeJson(SIGNS_FILE, signs);
    return newSign;
}

export async function deleteSign(id: string): Promise<boolean> {
    const signs = await getSigns();
    const filtered = signs.filter((s) => String(s.id) !== String(id));
    if (filtered.length === signs.length) return false;

    await writeJson(SIGNS_FILE, filtered);
    return true;
}

// USERS
export async function getUsers(): Promise<User[]> {
    await delay(100);
    return readJson<User>(USERS_FILE);
}

export async function getUserById(id: string): Promise<User | undefined> {
    const users = await getUsers();
    return users.find((u) => String(u.id) === String(id));
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const users = await getUsers();
    return users.find((u) => u.username === username);
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
    const users = await getUsers();
    if (users.some(u => u.username === user.username)) {
        throw new Error('Username already exists');
    }
    const newUser = { ...user, id: crypto.randomUUID() };
    users.push(newUser);
    await writeJson(USERS_FILE, users);
    return newUser;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const users = await getUsers();
    const index = users.findIndex((u) => String(u.id) === String(id));
    if (index === -1) return null;

    users[index] = { ...users[index], ...data };
    await writeJson(USERS_FILE, users);
    return users[index];
}

export async function deleteUser(id: string): Promise<boolean> {
    const users = await getUsers();
    const filtered = users.filter((u) => String(u.id) !== String(id));
    if (filtered.length === users.length) return false;

    await writeJson(USERS_FILE, filtered);
    return true;
}
