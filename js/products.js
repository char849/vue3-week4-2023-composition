import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

const app = createApp({
  setup() {
    const apiUrl = "https://vue3-course-api.hexschool.io/v2";
    const apiPath = "charlotte-lee849";
    const products = ref([]);
    const isNew = ref(false);
    const tempProduct = ref({
      imagesUrl: [],
    });
    const pagination = ref({});

    const checkAdmin = () => {
      const url = `${apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "index.html";
        });
    };
    // 參數預設值 pgae , query -> ?page=${}
    const getData = (page = 1) => {
      const url = `${apiUrl}/api/${apiPath}/admin/products/?page=${page}`;
      axios
        .get(url)
        .then((res) => {
          products.value = res.data.products;
          pagination.value = res.data.pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "index.html";
        });
    };

    const openModal = (type, item) => {
      if (type === "new") {
        tempProduct.value = {
          imagesUrl: [],
        };
        isNew.value = true;
        productModal.show();
      } else if (type === "edit") {
        tempProduct.value = { ...item };
        isNew.value = false;
        productModal.show();
      } else if (type === "delete") {
        tempProduct.value = { ...item };
        delProductModal.show();
      }
    };

    onMounted(() => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common.Authorization = token;
      checkAdmin();
    });

    return {
      products,      
      tempProduct,
      pagination,
      isNew,
      getData,
      openModal,      
    };
  },
});

app.component("pagination", {
  template: "#pagination",
  props: ["pages"],
  setup(props, { emit }) {
    const emitPages = (page) => {
      emit("emit-pages", page);
    };
    return {
      emitPages,
    };
  },
});

app.component("productModal", {
  template: "#productModal",
  props: ["tempProduct", "isNew"],
  setup(props, { emit }) {
    const apiUrl = "https://vue3-course-api.hexschool.io/v2";
    const apiPath = "charlotte-lee849";

    const updateProduct = () => {
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let http = "post";

      if (!props.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${props.tempProduct.id}`;
        http = "put";
      }
      axios[http](url, { data: props.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          emit("get-data");
        })
        .catch((err) => {
          alert(err.response.message);
        });
    };
    const createImages = () => {
      props.value.imagesUrl = [];
      props.value.imagesUrl.push();
    };
    onMounted(() => {
      productModal = new bootstrap.Modal(
        document.getElementById("productModal"),
        {
          keyboard: false,
          backdrop: "static",
        }
      );
    });
    return {
      updateProduct,
      createImages,
    };
  },
});

app.component("delProductModal", {
  template: "#delProductModal",
  props: ["tempProduct"],
  setup(props, { emit }) {
    const apiUrl = "https://vue3-course-api.hexschool.io/v2";
    const apiPath = "charlotte-lee849";

    const delProduct = () => {
      const url = `${apiUrl}/api/${apiPath}/admin/product/${props.tempProduct.id}`;
      axios.delete(url).then((res) => {
        alert(res.data.message);
        delProductModal.hide();
        emit("get-data");
      });
    };
    const openModal = () => {
      delProductModal.show();
    };
    onMounted(() => {
      delProductModal = new bootstrap.Modal(
        document.getElementById("delProductModal"),
        {
          keyboard: false,
          backdrop: "static",
        }
      );
    });

    return {
      delProduct,
      openModal,
    }
  },
});
app.mount("#app");
