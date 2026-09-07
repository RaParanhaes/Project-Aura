# Room action packet matrix

This matrix records the Polaris packet boundary for resident actions. A send is only an intent; the confirmation column is the evidence that may close the activity.

| Action | AURA sends to Polaris | Payload | Confirmation from Polaris | Current evidence |
| --- | --- | --- | --- | --- |
| Wave / kiss / laugh / thumbs-up | `RoomUserActionEvent` `2456` | action `1` / `2` / `3` / `7` | `RoomUserActionComposer` `1631` with the same action | Polaris handler confirmed |
| Raise / lower sign | `RoomUserSignEvent` `1975` | sign `0..17` | `RoomUserStatusComposer` `1640`, status `sign` | Contract boundary |
| Start / stop dance | `RoomUserDanceEvent` `2080` | dance `0..4` (`0` stops) | `RoomUserDanceComposer` `2233` | Polaris handler confirmed |
| Sit / stand | `RoomUserSitEvent` `2235` | posture `1` / `0` | `RoomUserStatusComposer` `1640`, status `sit` or standing state | Existing live posture path |
| Walk | `RoomUserWalkEvent` `3320` | destination `x,y` | `RoomUserStatusComposer` `1640`, movement status | F8.2 live validated |
| Turn/look at tile | `RoomUserLookAtPoint` `3301` | tile `x,y` | `RoomUserStatusComposer` `1640`, orientation status update | Contract boundary |
| Give hand item | `RoomUserGiveHandItemEvent` `2941` | target room-unit id | `RoomUserReceivedHandItemComposer` `354` plus hand-item state `1474` | Contract boundary |
| Drop hand item | `RoomUserDropHandItemEvent` `2814` | no body | `RoomUserHandItemComposer` `1474` with hand item `0` | Polaris handler confirmed |
| Use room object | object-specific event, commonly `ToggleFloorItemEvent` `99` | item id and action data | object-specific floor-item update or user status/effect event | Must be mapped per furniture |
| Create room | `RequestCreateRoomEvent` `2752` | name, description, model, category, capacity, trade mode | `RoomCreatedComposer` `1304` with the new room id | Contract boundary |
| Start item trade | `TradeStartEvent` `1481` | target room-unit id | `TradeStartComposer` `2505` or `TradeStartFailComposer` `217` | Must be live validated |
| Offer item in trade | `TradeOfferItemEvent` `3107` | inventory item id | `TradeUpdateComposer` `2024` | Must be live validated |
| Accept/complete trade | `TradeAcceptEvent` `3863` and `TradeConfirmEvent` `2760` | trade confirmation data | `TradeAcceptedComposer` `2568`, then `TradeCompleteComposer` `2369` | Must be live validated |

The AURA activity remains `pending` until the confirmation is observed. For object use and trade, the exact confirmation depends on the furniture or negotiation state and must not be inferred from the outgoing packet alone.

Read-only requests use the same rule: a response header closes transport delivery, while the activity remains pending until its bounded profile, inventory or catalog payload parser accepts the response.

## P3.10/P3.11 live smoke evidence

On 2026-09-06, `aura_f7_1` authenticated against the local CMS/Polaris stack, entered AAA (room 1), and sent the frozen action packets for kiss (`UNIT_ACTION=2`), dance type 3, sit, orientation `(4,5)` and sign 5 while Cabana was connected. Polaris returned `ROOM_USER_ACTION` 1631, `ROOM_USER_DANCE` 2233 and `UNIT_STATUS` 1640 frames containing the resident status and `sign 5`. The only effect packet had ID 0; no non-zero effect was applied.
