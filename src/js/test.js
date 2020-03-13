const aaa = `hello`;

const bbb = `${aaa} world`;

const ccc = () => {
  document.getElementById('text').innerHTML = 'こんにちは世界';
};
ccc();

const src = { one: '1', two: '2', three: '3' };
const dist = { ...src };
console.log(dist);
