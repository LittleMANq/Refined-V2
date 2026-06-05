import type { Piece } from '../data';

/**
 * Closet filter categories (the chips on the Closet screen). A lightweight,
 * client-side classifier over a piece's type/subtype text, Hebrew-first with
 * English fallbacks. Outerwear groups under "tops" (upper-body garments).
 */
export type ClosetCategory = 'tops' | 'bottoms' | 'dresses' | 'shoes' | 'accessories' | 'other';

const KEYWORDS: Record<Exclude<ClosetCategory, 'other'>, string[]> = {
  dresses: ['שמלה', 'אוברול', 'סרבל', 'dress', 'gown', 'jumpsuit', 'overall'],
  shoes: ['נעל', 'מגף', 'סניקרס', 'עקב', 'סנדל', 'shoe', 'boot', 'sneaker', 'heel', 'sandal'],
  accessories: ['תיק', 'חגורה', 'צעיף', 'כובע', 'שרשרת', 'תכשיט', 'משקפ', 'bag', 'belt', 'scarf', 'hat', 'jewel', 'sunglass'],
  tops: [
    'חולצה', 'טופ', 'סוודר', 'סריג', 'גופייה', "ז'קט", 'זקט', 'גקט', 'בלייזר', 'מעיל', 'קרדיגן',
    'top', 'shirt', 'tee', 'blouse', 'sweater', 'knit', 'hoodie', 'jacket', 'coat', 'blazer', 'cardigan',
  ],
  bottoms: ['מכנס', 'גינס', 'גי', 'חצאית', 'שורט', 'pant', 'trouser', 'jean', 'skirt', 'short'],
};

const ORDER: Exclude<ClosetCategory, 'other'>[] = ['dresses', 'shoes', 'accessories', 'tops', 'bottoms'];

export function pieceCategory(piece: Piece): ClosetCategory {
  const hay = `${piece.type ?? ''} ${piece.subtype ?? ''}`.toLowerCase();
  if (!hay.trim()) return 'other';
  for (const category of ORDER) {
    if (KEYWORDS[category].some((k) => hay.includes(k.toLowerCase()))) return category;
  }
  return 'other';
}
