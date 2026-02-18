const fs = require('fs');
const path = '../data/users.json';

function readUsers() {
  try { return JSON.parse(fs.readFileSync(path,'utf8')); }
  catch(err){ return []; }
}

function writeUsers(users) {
  try { fs.writeFileSync(path, JSON.stringify(users,null,2)); }
  catch(err){ console.error('Error writing JSON:', err); }
}

function updateWallet(userId, amount){
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  if(user){
    user.wallet += amount;
    writeUsers(users);
    return true;
  }
  return false;
}

module.exports = { readUsers, writeUsers, updateWallet };
