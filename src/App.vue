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
    if (!localStorage.getItem('boards')) {
      localStorage.setItem('boards', JSON.stringify(this.lists));
    } else {
      this.lists = JSON.parse(localStorage.getItem('boards'));
    }
  },

  methods: {
    onDrop(e, idx) {
      const cardElem = e.dataTransfer.getData('card')
      this.lists[idx].cards.push(JSON.parse(cardElem))
      this.saveChangingInLocalStorage()
    },
    onDrag(e, index, idx) {
      const elem = this.lists[idx].cards
      e.dataTransfer.setData('card', JSON.stringify(elem[index]))
      setTimeout(() => {
        elem.splice(elem.indexOf(elem[index]), 1)
      }, 0)

    },
    createNewList() {
      if (this.board.list.length >= 3) {
        this.lists.push(JSON.parse(JSON.stringify(this.board)))
        this.board.list = ''
        this.saveChangingInLocalStorage()
      } else {
        let inp = document.querySelector('.inputCreateList')
        this.board.list = ''
        inp.placeholder = 'To short'
        inp.style.border = '3px solid red'
        setTimeout(() => {
          inp.placeholder = 'List title'
          inp.style.border = '1px solid black'
        }, 2000)
      }
    },
    deleteList(idx) {
      if (!this.lists[idx].cards.length) {
        this.lists.splice(idx, 1)
        this.saveChangingInLocalStorage()
      } else {
        this.textMessage = true;
        setTimeout(() => {
          this.textMessage = false;
        }, 3000)
      }
    },
    createNewCard(idx) {
      if (this.card.title.length >= 1) {
        this.card.createdTime = Date.now()
        this.lists[idx].cards.push(JSON.parse(JSON.stringify(this.card)))
        this.card.title = ''
        this.lists[idx].isActive = false
        this.saveChangingInLocalStorage()
      } else {
        this.card.title = ''
        this.lists[idx].isActive = false
      }
    },
    deleteCard(idx, index) {
      console.log(idx)
      this.lists[idx].cards.splice(index, 1)
      this.saveChangingInLocalStorage()
    },
    saveChangingInLocalStorage() {
      localStorage.setItem('boards', JSON.stringify(this.lists))
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
