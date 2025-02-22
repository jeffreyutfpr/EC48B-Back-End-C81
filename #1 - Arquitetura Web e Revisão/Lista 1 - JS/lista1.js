// 1. Função que calcula e retorna o fatorial de um número.
function fatorial(n) {
    if (n < 0) return null;
    if (n === 0 || n === 1) return 1;
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
      resultado *= i;
    }
    return resultado;
  }
  
  // 2. Função que retorna uma String contendo uma sequência de N mensagens do texto informado.
  function repetirMensagem(n, mensagem) {
    let resultado = "";
    for (let i = 0; i < n; i++) {
      resultado += mensagem;
      if (i < n - 1) {
        resultado += " ";
      }
    }
    return resultado;
  }
  
  // 3. Função que recebe 2 valores e uma operação básica e retorna o resultado da operação.
  function operacaoBasica(valor1, valor2, operacao) {
    switch (operacao) {
      case '+':
        return valor1 + valor2;
      case '-':
        return valor1 - valor2;
      case '*':
        return valor1 * valor2;
      case '/':
        if (valor2 === 0) return null;
        return valor1 / valor2;
      default:
        return null;
    }
  }
  
  // 4. Função que retorna um vetor contendo o resultado da tabuada de um número.
  // Considerando a tabuada de 1 a 10.
  function tabuada(numero) {
    const resultados = [];
    for (let i = 1; i <= 10; i++) {
      resultados.push(numero * i);
    }
    return resultados;
  }
  
  // 5. Função que retorna um número fornecido, porém invertido.
  function inverterNumero(num) {
    const invertidoStr = num.toString().split('').reverse().join('');
    return parseInt(invertidoStr, 10);
  }
  
  // 6. Função que conta o número de vogais contidas em uma string.
  function contarVogais(texto) {
    const vogais = 'aeiouAEIOU';
    let contador = 0;
    for (let char of texto) {
      if (vogais.includes(char)) {
        contador++;
      }
    }
    return contador;
  }
  
  // 7. Função que verifica se uma sequência de parênteses e colchetes está bem formada.
  function sequenciaBemFormada(seq) {
    const stack = [];
    const pares = {
      ')': '(',
      ']': '['
    };
  
    for (let char of seq) {
      if (char === '(' || char === '[') {
        stack.push(char);
      } else if (char === ')' || char === ']') {
        if (stack.length === 0 || stack.pop() !== pares[char]) {
          return false;
        }
      }
    }
    return stack.length === 0;
  }
  
  // 8. Função que gera uma lista de objetos com id, nome e idade aleatórios.
  function gerarPessoas(qtd) {
    const nomes = ["Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gustavo", "Helena", "Isabela", "João"];
    const pessoas = [];
    for (let i = 0; i < qtd; i++) {
      const id = i + 1;
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const idade = Math.floor(Math.random() * (90 - 18 + 1)) + 18;
      pessoas.push({ id, nome, idade });
    }
    return pessoas;
  }
  
  // 9. Função que recebe uma lista de objetos (com propriedade "idade") e calcula a média de idades.
  function mediaIdades(listaPessoas) {
    if (listaPessoas.length === 0) return 0;
    const soma = listaPessoas.reduce((acc, pessoa) => acc + pessoa.idade, 0);
    return soma / listaPessoas.length;
  }
  
  // 10. Função que recebe a lista de objetos e ordena os dados por um dos atributos informados.
  function ordenarPessoas(listaPessoas, atributo) {
    if (listaPessoas.length === 0 || !listaPessoas[0].hasOwnProperty(atributo)) {
      return listaPessoas;
    }
    const listaOrdenada = [...listaPessoas].sort((a, b) => {
      if (typeof a[atributo] === 'number' && typeof b[atributo] === 'number') {
        return a[atributo] - b[atributo];
      }
      if (typeof a[atributo] === 'string' && typeof b[atributo] === 'string') {
        return a[atributo].localeCompare(b[atributo]);
      }
      return 0;
    });
    return listaOrdenada;
  }
  
  // Exemplos de uso (os resultados podem ser visualizados no console se forem chamados) ou por Go Live (usando index.html):
  console.log(fatorial(5));
  console.log(repetirMensagem(3, "Olá!"));
  console.log(operacaoBasica(10, 2, '/'));
  console.log(tabuada(7));
  console.log(inverterNumero(875));
  console.log(contarVogais("Brocolis"));
  console.log(sequenciaBemFormada("(([]))"));
  const pessoas = gerarPessoas(5);
  console.log(pessoas);
  console.log(mediaIdades(pessoas));
  console.log(ordenarPessoas(pessoas, "nome"));
  