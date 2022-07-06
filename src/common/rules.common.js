import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class RulesCommon {
  constructor() {
    this.rulesActive = false;
    this.contacts = this.getContactsFromFile();
  }

  getContactsFromFile() {
    const contactList = [];
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filename = 'contacts.txt';
    const file = path.join(__dirname, '..', '..', filename);

    if (fs.existsSync(file)) {
      const contacts = fs.readFileSync(file, 'utf8');
      const lines = contacts.split(/\s*[,;]\s*/g);

      for (const line of lines) {
        if (line !== '') {
          contactList.push(line);
        }
      }
    }

    return contactList;
  }

  sanitizeContact(contact) {
    return `${contact}@c.us`;
  }

  allowedContacts() {
    const arr = [];

    for (const contact of this.contacts) {
      arr.push(this.sanitizeContact(contact));
    }

    return arr;
  }
}

export default RulesCommon;
