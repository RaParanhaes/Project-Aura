import { encodePacketBody } from './packet-body.js';
import { FROZEN_PACKET_REGISTRY } from './frozen-packet-registry.js';

const c2s = (name: string) => FROZEN_PACKET_REGISTRY.requireByName('client_to_server', name);

export class UserProfileRequestComposer {
  public constructor(private readonly userId: number, private readonly showProfile = true) {}
  public encode(): Uint8Array { return encodePacketBody(c2s('USER_PROFILE'), writer => writer.writeInt(this.userId).writeBoolean(this.showProfile)); }
}

export class InventoryItemsRequestComposer {
  public encode(): Uint8Array { return encodePacketBody(c2s('INVENTORY_ITEMS'), () => undefined); }
}

export class InventoryBadgesRequestComposer {
  public encode(): Uint8Array { return encodePacketBody(c2s('INVENTORY_BADGES'), () => undefined); }
}

export class CatalogPageRequestComposer {
  public constructor(private readonly pageId: number, private readonly offerId = 0, private readonly mode = 'normal') {}
  public encode(): Uint8Array { return encodePacketBody(c2s('CATALOG_PAGE'), writer => writer.writeInt(this.pageId).writeInt(this.offerId).writeString(this.mode)); }
}

export type ReadConfirmationKind = 'profile' | 'inventory_items' | 'inventory_badges' | 'catalog_page';
export const READ_CONFIRMATION_HEADERS: Readonly<Record<ReadConfirmationKind, number>> = Object.freeze({ profile: 3898, inventory_items: 994, inventory_badges: 717, catalog_page: 804 });
