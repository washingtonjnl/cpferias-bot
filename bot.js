const twit = require('twit'); // requisitando a biblioteca do Twitter
const auth = require('./auth.js'); // requisitando os autenticadores da API do Twitter
const randomItem = require('random-item'); // requisitando a biblioteca para selecionar um item aleatório num array
const schedule = require('node-schedule'); // requisitando biblioteca para agendar os tweets
const moment = require('moment'); // requisitando biblioteca de manipulação de datas

const T = new twit(auth); // passando os dados de autorização da API para a biblioteca

// setando arrays com as frases complementares dos tweets, separadas por período de tempo

var farComplementPhrase = [
    'De dia em dia a galinha enche o papo.',
    'No longo prazo, todos estaremos formados.',
    'As férias são um prato que se serve frio, mas é uma delícia.',
    'Quem conta um conto, entra de férias mais rápido',
    'Quem espera, sempre entra de férias.',
    'Esperar é doloroso. Esquecer é doloroso, mas ficar de férias é gostosinho.',
    'Paciência é a arte de saber esperar as férias.',
    'Para quem sabe esperar um trimestre não é nada.'
];

var soonComplementPhrase = [
    'Vamo que ta chegandoooo.',
    'Falta pouco, meus amigos, aguentem firme!',
    'Se você parar pra pensar, hoje falta menos que ontem.',
    'Se ainda achar que falta muito, olha o tweet de ontem.',
    'Olha pelo lado bom: se você já esperou até aqui, quer dizer que falta pouco.',
    'Levanta feliz que hoje falta menos um dia pras férias!',
    'Dá uma olhada pra trás e vê o quanto você já conseguiu aguentar, é incrível!',
    'Bom, vou te contar um negócio: suas férias estão cada vez mais próximas rs.'
];

var nowComplementPhrase = [
    'MEUDEUS! Estamos na última semanaaaaaaa.',
    'Já pode preparar o protetor solar em...',
    'Elas tão chegando e aquela pergunta vem: será que o RioCard vai passar?',
    'É hoje!! Ai, não, desculpa, me empolguei.',
    'Eu também queria que hoje já fosse o último dia... Mas tá quase!',
    'Ai, ta muito perto, já planejou o #praiou com a turma?',
    'Puts kkk já to sentindo até o ventinho de não aula.',
    'To escutando o ultimo sinal daqui, vocês também?'
];

var todayComplementPhrase = [
    'Cara, é hoje, tupo, hoje mesmo!!!!!',
    'Depois de tanto esperar, elas chegaram, meus amigos, as tão esperadas FÉRIAS!',
    'AAAAAAAAAA hoje é o último dia mesmoooooo!!! Repito, não é um treinamento, galera!'
];

// criando a função que diminui a datas

function calculateDays(date) {

    // formato do brasil 'pt-br'
    moment.locale('pt-br');

    // requisitando a data atual
    var todayDate = moment();
    
    // declarando a data do último dia letivo
    var finalDate = moment(date);
    
    // tirando a diferenca da finalDate - todayDate em dias
    var daysRemaining  = finalDate.diff(todayDate, 'days');
    
    return daysRemaining;

};

// definindo o último letivo e recebendo o resultado dos dias restantes (a data deve ser definida no formato YYYY-MM-DD)

var daysRemaining = calculateDays('2020-01-15');

// criando função que fará o tweet

function postTweet() {

    // definindo as regras de seleção das frases complementares
    if (daysRemaining > 30) {
        prhase = randomItem(farComplementPhrase);
    } else if (daysRemaining <= 30 && daysRemaining >= 8) {
        prhase = randomItem(soonComplementPhrase);
    } else if (daysRemaining <= 7 && daysRemaining > 1) {
        prhase = randomItem(nowComplementPhrase);
    } else if (daysRemaining == 0) {
        prhase = randomItem(todayComplementPhrase)
    }

    // git definindo a mensagem que será postada
    var msg = `Bom dia, soldados da ciência! Faltam ${daysRemaining} dias para o fim do ano letivo. ${prhase}`;

    // postando o tweet
    T.post('statuses/update', { status: msg }, tweeted());

    // callback para quando o tweet for postado
    function tweeted(err, data, response) {
        if (err) {
        console.log('Algo deu errado e não foi possível publicar o tweet :(');
        } else {
        console.log('Tweet publicado com sucesso!');
        }
    }

}

// agendando o tweet para um horário específico (no caso, 05:30 AM)

var scheduleTweet = schedule.scheduleJob('30 5 * * *', postTweet());