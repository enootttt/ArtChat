function _bem(
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export function useNamespace(block: string) {
  const namespace = 'art'

  const b = (blockSuffix = '') => _bem(namespace, block, blockSuffix, '', '')

  return {
    namespace,
    b,
  }
}
