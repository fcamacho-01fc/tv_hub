import type { RequestHandler } from 'express';
import { Channel } from '../models/channel.model.js';

function readQueryValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const listChannels: RequestHandler = async (request, response) => {
  const search = readQueryValue(request.query.search);
  const category = readQueryValue(request.query.category);
  const country = readQueryValue(request.query.country);
  const requestedSort = readQueryValue(request.query.sort);

  // Start by showing only channels that are available to viewers.
  const filter: Record<string, unknown> = { isActive: true };

  if (search) {
    const searchExpression = new RegExp(escapeRegularExpression(search), 'i');
    filter.$or = [
      { name: searchExpression },
      { country: searchExpression },
      { categories: searchExpression }
    ];
  }

  if (category) {
    filter.categories = new RegExp(escapeRegularExpression(category), 'i');
  }

  if (country) {
    filter.country = new RegExp(`^${escapeRegularExpression(country)}$`, 'i');
  }

  // MISIÓN OPCIONAL C:
  // Completa el campo usado para ordenar por nombre.
  // Pista: revisa los campos definidos en el modelo Channel.
  const sort = requestedSort === 'country' ? 'country name' : '____';

  // TODO 1:
  // Recupera los canales que coinciden con el filtro desde MongoDB.
  // Pista: ¿Qué método de Mongoose recupera varios documentos?
  const channels = await Channel.____(filter).sort(sort);

  response.json({ channels });
};
