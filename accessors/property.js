import { camelize } from 'inflector';
import BaseAccessor from './base';

class PropertyAccessor extends BaseAccessor {
  constructor (node, name) {
    super();

    this.node = node;
    this.name = camelize(name);
  }
}

export default PropertyAccessor;
