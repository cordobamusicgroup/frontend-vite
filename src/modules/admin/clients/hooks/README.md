# Clients Hooks Refactor

Este directorio contiene hooks desacoplados para queries y mutaciones relacionadas a Clients.

Hooks disponibles:

- useListClientsQuery: Obtiene la lista de clientes. Query Key: ['clients'].
- useClientQuery: Obtiene el detalle de un cliente por id. Query Key: ['client', id].
- useCreateClientMutation: Crea un cliente e invalida ['clients'].
- useUpdateClientMutation: Actualiza un cliente e invalida ['clients'] y ['client', id].
- useDeleteClientsMutation: Elimina uno o varios clientes e invalida ['clients'].

Racionales del cambio:

1. Single Responsibility: Cada hook hace una sola cosa (query vs mutación) facilitando tests y reuso.
2. Tree-shaking & Bundle: Los componentes importan sólo lo que necesitan.
3. Mejor tipado incremental: Podemos mejorar los tipos de cada hook sin tocar otros.
4. Claridad en invalidaciones: Cada mutación define explícitamente qué keys invalida.

Convenciones:

- Query Keys exportadas como constantes (p.ej. CLIENTS_LIST_QUERY_KEY, clientQueryKey(id)).
- Mutations reciben un objeto variables si necesitan múltiples argumentos (ej: { clientId, data }).
- Errores se normalizan con formatError antes de propagarse.

Próximos posibles pasos:

- Definir tipos fuertes (interfaces) para ClientListItem y ClientDetail.
- Añadir tests unitarios para lógica de payload e invalidaciones.
- Implementar optimistic updates para update/delete.
