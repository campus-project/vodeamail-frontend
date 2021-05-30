export const insertQuerySearch = (key: string, value: string | number) => {
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  let s = document.location.search;
  const kvp = key + "=" + value;

  const r = new RegExp("(&|\\?)" + key + "=[^&]*");

  s = s.replace(r, "$1" + kvp);

  if (!RegExp.$1) {
    s += (s.length > 0 ? "&" : "?") + kvp;
  }

  window.history.replaceState(null, document.title, s);
};

export const ordinalSuffixOf = (value: any) => {
  if (!Number(value)) {
    return "";
  }

  const j = parseFloat(value) % 10;
  const k = parseFloat(value) % 100;

  if (j === 1 && k !== 11) {
    return value + "st";
  }

  if (j === 2 && k !== 12) {
    return value + "nd";
  }

  if (j === 3 && k !== 13) {
    return value + "rd";
  }

  return value + "th";
};

export const mapHookFormErrors = (errors: any) => {
  let newErrors: any = {};

  Object.keys(errors).forEach((key) => {
    Object.assign(newErrors, {
      [key]: {
        message: errors[key][0]
          .replace(/_id/g, "")
          .replace(/ id/g, "")
          .replace(/\.\d{1,3}\./g, (match: string) => {
            return ` ${match
              .replace(/\./g, "")
              .replace(/\d{1,3}/g, (a) =>
                ordinalSuffixOf(parseFloat(a) + 1)
              )} `;
          })
          .replace(/\w\.\w/g, (match: string) => match.replace(/\./g, " "))
          .replace(/_/g, " "),
      },
    });
  });

  return newErrors;
};
