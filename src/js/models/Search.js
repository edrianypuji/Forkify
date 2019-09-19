import axios from 'axios';
export default class Search {
  constructor(query) {
    this.query = query;

  }

  async getResult() {
    const key = 'be6a69bc469eee9e111d39995324a564';
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    try {
      const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      //console.log(this.result);
    } catch(error) { 
        alert(error);
    }
  }
  
}