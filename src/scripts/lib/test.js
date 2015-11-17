import { forEach } from './arrayUtils'

export function test() {
  forEach.call('testing testing'.split(' '), console.log.bind(console));
}
