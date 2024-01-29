import { defineComponent } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
export default defineComponent({
  props: ["pages"],
  setup(props, { emit }) {
    const emitPages = (page) => {
      emit('emit-pages', page);
    };
    return {
      emitPages
    };
  },
  template: `<nav aria-label="Page navigation example">
     <ul class="pagination">
       <li class="page-item" :class="{disabled: !pages.has_pre}">
         <a class="page-link" href="#" aria-label="Previous"
         @click.prevent="emitPages(pages.current_page - 1)">
           <span aria-hidden="true">&laquo;</span>
         </a>
       </li>
       <li class="page-item" v-for="page in pages.total_pages" :key="page + 'page'" :class="{'active': page === pages.current_page}"><a class="page-link" href="#" @click.prevent="emitPages(page)">{{page}}</a></li>
       <li class="page-item" :class="{disabled: !pages.has_next}">
         <a class="page-link" href="#" aria-label="Next"
         @click.prevent="emitPages(pages.current_page + 1)">
           <span aria-hidden="true">&raquo;</span>
         </a>
       </li>
     </ul>
   </nav>
 ` });
