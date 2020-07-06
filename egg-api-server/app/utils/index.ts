export const toCamel = str => {
  return str.replace(/([^_])(?:_+([^_]))/g, function(_, $1, $2) {
    return $1 + $2.toUpperCase();
  });
};

export const objectKeyToCamel = obj => {
  const camelObj = {};
  for (const prop in obj) {
    camelObj[toCamel(prop)] = obj[prop];
  }

  return camelObj;
};

export const outLoginTokenKey = 'outLoginToken';

interface AnyObject {
  [proName: string]: any;
}

export const successFn = (data: AnyObject) => {
  return {
    status: 'ok',
    ...data,
  };
};

export const failFn = (data: AnyObject) => {
  return {
    status: 'error',
    ...data,
  };
};
