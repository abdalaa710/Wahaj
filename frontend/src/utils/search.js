/**
 * WAHAJ Smart Scientific Search Engine
 * Supports bilingual Arabic/English queries, acronyms, PSI-IDs, and material keywords.
 */

export const matchInvestigation = (inv, rawQuery) => {
  if (!rawQuery || !rawQuery.trim()) return true;
  const q = rawQuery.trim().toLowerCase();

  // Arabic aliases mapping to NASA experiment identifiers & concepts
  const aliases = {
    'سافاير': ['saffire', 'psi-98', 'psi-99', 'psi-100', 'cygnus'],
    'سفاير': ['saffire', 'psi-98', 'psi-99', 'psi-100', 'cygnus'],
    'فليكس': ['flex', 'psi-69', 'droplet'],
    'باس': ['bass', 'psi-25', 'psi-26', 'msg'],
    'قطرة': ['droplet', 'flex', 'psi-69', 'psi-117', 'methanol', 'heptane'],
    'قطرات': ['droplet', 'flex', 'psi-69', 'psi-117', 'methanol', 'heptane'],
    'بارد': ['cool', 'cfi', 'psi-159', 'psi-117'],
    'لهب بارد': ['cool', 'cfi', 'psi-159', 'psi-117'],
    'دخان': ['same', 'smoke', 'psi-101', 'psi-102'],
    'سخام': ['soot', 'spice', 'psi-107'],
    'قماش': ['sibal', 'fabric', 'psi-98', 'psi-100'],
    'بوليمر': ['pmma', 'polymer', 'psi-25', 'psi-99'],
    'أكريليك': ['pmma', 'acrylic', 'psi-25'],
    'اكريليك': ['pmma', 'acrylic', 'psi-25'],
    'سيليكون': ['silicone', 'psi-99'],
    'نومكس': ['nomex', 'psi-99'],
    'حريق': ['saffire', 'fire', 'combustion'],
    'محطة': ['iss', 'glovebox', 'cir'],
    'غاز': ['cfi', 'spice', 'gas', 'methane', 'ethylene']
  };

  // Check if query matches any alias
  for (const [arKey, mappedTerms] of Object.entries(aliases)) {
    if (q.includes(arKey)) {
      if (mappedTerms.some(term => 
        inv.psi_id.toLowerCase().includes(term) ||
        inv.name.toLowerCase().includes(term) ||
        (inv.category && inv.category.toLowerCase().includes(term))
      )) {
        return true;
      }
    }
  }

  // Direct string matching across all fields
  return (
    inv.name.toLowerCase().includes(q) ||
    inv.psi_id.toLowerCase().includes(q) ||
    (inv.materials && inv.materials.toLowerCase().includes(q)) ||
    (inv.platform && inv.platform.toLowerCase().includes(q)) ||
    (inv.category && inv.category.toLowerCase().includes(q)) ||
    (inv.description && inv.description.toLowerCase().includes(q)) ||
    (inv.descriptionAr && inv.descriptionAr.toLowerCase().includes(q))
  );
};
