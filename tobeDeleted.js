getUsefulString('Chike Ft Ric Hassani')
function getUsefulString(string) {
  string = string.split('').slice(0, string.indexOf('Ft')).join('').trim();
  return(string, string.length)
}