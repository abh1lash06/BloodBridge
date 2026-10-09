import apiClient from './client';

export async function getAllPages<T>(url: string): Promise<T[]> {
  const all: T[] = [];
  for (let page = 0; page < 200; page++) {
    const response = await apiClient.get(url, { params: { page, size: 50 } });
    const data = response.data;
    if (Array.isArray(data)) return [...all, ...data];
    if (!Array.isArray(data?.content)) return all;
    all.push(...data.content);
    if (data.last === true || data.content.length < 50 ||
        (typeof data.totalPages === 'number' && page + 1 >= data.totalPages)) break;
  }
  return all;
}
