/**
 * Queens Box fields withheld until verified — never render when verified !== true.
 */
const QUEENS_BOX_FIELDS = {
  box_composition: { value: null, verified: false, note: 'TODO: box_composition' },
  box_price: { value: null, verified: false, note: 'TODO: box_price' },
  box_order_method: { value: null, verified: false, note: 'TODO: box_order_method' },
  box_order_deadline: { value: null, verified: false, note: 'TODO: box_order_deadline' },
  box_pickup_hours: { value: null, verified: false, note: 'TODO: box_pickup_hours' },
  box_delivery_area: { value: null, verified: false, note: 'TODO: box_delivery_area' },
  box_min_order: { value: null, verified: false, note: 'TODO: box_min_order' },
  box_photos: { value: null, verified: false, note: 'TODO: box_photos' },
};

function getVerifiedQueensBoxFields() {
  const out = {};
  for (const [key, field] of Object.entries(QUEENS_BOX_FIELDS)) {
    if (field.verified === true && field.value != null) out[key] = field.value;
  }
  return out;
}

module.exports = { QUEENS_BOX_FIELDS, getVerifiedQueensBoxFields };
