-- Renumber every People section as 1, 2, 3... while preserving its current order.

with ranked_assignments as (
  select
    id,
    row_number() over (
      partition by section
      order by sort_order asc, created_at asc, id asc
    )::integer as normalized_order
  from public.person_assignments
)
update public.person_assignments pa
set sort_order = ranked.normalized_order
from ranked_assignments ranked
where pa.id = ranked.id
  and pa.sort_order is distinct from ranked.normalized_order;
