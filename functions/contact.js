const fs = require("fs");

const loadContact = () => {
  const contacts = JSON.parse(fs.readFileSync("data/contact.json", "utf-8"));
  return contacts;
};

const findContact = (nama) => {
  const contacts = loadContact();
  const contactFound = contacts.find((contact) => {
    return contact.nama == nama;
  });
  return contactFound;
};

const deleteContact = (nama) => {
  const contacts = loadContact();
  const newContacts = contacts.filter((contact) => contact.nama !== nama);
  fs.writeFileSync("data/contact.json", JSON.stringify(newContacts));
};

const saveData = (data) => {
  const contacts = loadContact();
  contacts.push(data);
  fs.writeFileSync("data/contact.json", JSON.stringify(contacts));
};

const cekDuplikat = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama === nama);
  if (contact) {
    return true;
  }
  return false;
};

const editContact = (data) => {
  const contacts = loadContact();
  const index = contacts.findIndex((contact) => contact.nama === data.oldNama);
  delete data.oldNama;
  contacts[index] = data;
  fs.writeFileSync("data/contact.json", JSON.stringify(contacts));
};

module.exports = {
  loadContact,
  findContact,
  deleteContact,
  saveData,
  cekDuplikat,
  editContact,
};
