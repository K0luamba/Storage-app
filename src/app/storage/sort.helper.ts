import { Box } from './types';

export class SortHelper {
    public static sortByDeliveryDate(b1: Box, b2: Box) {
        if (b1.deliveryDate > b2.deliveryDate) {
            return 1;
        }
        if (b1.deliveryDate < b2.deliveryDate) {
            return -1;
        }
        return 0;
    }

    public static sortByProductName(b1: Box, b2: Box) {
        if (b1.product.name > b2.product.name) {
            return 1;
        }
        if (b1.product.name < b2.product.name) {
            return -1;
        }
        return 0;
    }
}
