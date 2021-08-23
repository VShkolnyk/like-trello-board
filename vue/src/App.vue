<template>
  <div id="app">
    <form @click.prevent>
      <input
          type="text"
          placeholder="List title"
          v-model="board.list"
          @keypress.enter="createNewList"
          class="inputCreateList"
      >
      <input type="button" value="Create List" @click="createNewList">
    </form>
    <div v-if="textMessage" class="error">You can delete only empty list</div>

    <div v-if="!lists.length" class="noLists"><h2>Add your first board</h2></div>

    <div class="wrapper">
      <div
          class="list"
          v-for="(list, idx) in lists"
          :key="idx"
          @dragover.prevent
          @dragenter.prevent
          @drop="onDrop($event, idx)"
      >
        <div class="list__header">
          <button @click="list.isActive = !list.isActive">+ add new cart</button>
          <form @click.prevent v-if="list.isActive">
            <input
                type="text"
                placeholder="Card title"
                v-model="card.title"
                @keypress.enter="createNewCard(idx)"
                class="inputCreateCard"
            >
            <input type="button" value="Create Card" @click="createNewCard(idx)">
          </form>
        </div>
        <div class="list__main">
          <h3>{{ list.list }}</h3>

          <div
              class="card"
              v-for="(card, index) in list.cards"
              :key="index"
              @dragstart="onDrag($event, index, idx)"
              draggable="true"
          >
            <p>{{ card.title }}</p>
            <button @click="deleteCard(idx, index)"><img src="@/assets/styles/image/delete.png"></button>
            <span>{{ time(idx, index) }}</span>
          </div>

        </div>
        <div class="list__footer">
          <button @click="deleteList(idx)">delete list <img src="@/assets/styles/image/delete.png"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
// git commit -m "edit trello-board with node.js"
export default {
  name: 'App',
  data() {
    return {
      lists: [],
      board: {
        list: '',
        cards: [],
        isActive: false,
      },
      card: {
        title: '',
        createdTime: 0
      },
      textMessage: false
    }
  },

  beforeMount() {
    axios.get('http://localhost:3000/lists')
        .then((response) => {
          this.lists = response.data
        }).catch((e) => console.log('Error', e))
  },

  methods: {
    async onDrop(e, idx) {
      const cardElem = e.dataTransfer.getData('card');
      await axios.post(`http://localhost:3000/lists/${idx}/drop`, JSON.parse(cardElem))
          .then((res) => this.render())
          .catch((e) => console.log(e))
    },
    async onDrag(e, index, idx) {
      const elem = this.lists[idx].cards
      e.dataTransfer.setData('card', JSON.stringify(elem[index]))

      await axios.post(`http://localhost:3000/lists/${idx}/cards/${index}/drag`, elem[index])
          .catch((e) => console.log(e))
      setTimeout(() => {
        elem.splice(elem.indexOf(elem[index]), 1)
      }, 0)
    },


    async render() {
      await axios.get('http://localhost:3000/lists')
          .then((response) => {
            this.lists = response.data
          }).catch((e) => console.log('Error', e))
    },

    async createNewList() {
      await axios.post('http://localhost:3000/lists', this.board)
          .then((response) => {
            this.board.list = ''
            this.render();
          }).catch((e) => console.log(e))
    },

    async deleteList(idx) {
      if (!this.lists[idx].cards.length) {
        await axios.delete(`http://localhost:3000/lists/delete/${idx}`)
            .then((res) => this.render())
            .catch((e) => console.log(e))
      } else {
        this.textMessage = true;
        setTimeout(() => {
          this.textMessage = false;
        }, 3000)
      }
    },

    async createNewCard(idx) {
      if (this.card.title.length >= 1) {
        this.card.createdTime = Date.now()
        await axios.post(`http://localhost:3000/lists/${idx}/cards`, this.card)
            .then((response) => {
              this.card.title = ''
              this.lists[idx].isActive = false
              this.render();
            }).catch((e) => console.log(e))
      } else {
        this.card.title = ''
        this.lists[idx].isActive = false
      }
    },

    async deleteCard(idx, index) {
      await axios.delete(`http://localhost:3000/lists/${idx}/cards/delete/${index}`)
          .then((res) => this.render())
          .catch((e) => console.log(e))
    },

    time(idx, index) {
      const t = (Date.now() - this.lists[idx].cards[index].createdTime) / 1000
      if (t < 60) return `${parseInt(t)} sec ago`
      if (t < 3600 && t >= 60) return `${parseInt(t / 60)} min ago`
      if (t < 86400 && t >= 3600) return `${parseInt(t / 3600)} hour ago`
      if (t >= 86400) return `${parseInt(t / 86400)} day ago`
    },
  }
}

</script>

<style lang="scss">
@import "@/assets/styles/main";
</style>
