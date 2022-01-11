<script>
export default {
  name: 'DropMenu',
  components: {

  },
  model: {
    prop: 'visible',
    event: 'hidden'
  },
  props: {
    visible: {
      type: Boolean
    },
    /**
     * 位置
     */
    position: {
      type: Object,
      default: () => ({
        left: 0,
        top: 0
      })
    },
    /**
     * 菜单下拉列表
     */
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    /**
     * 点击菜单选项
     */
    handleClick (event, command) {
      this.$emit('command', command)
      this.$emit('hidden', false)
    }
  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  beforeDestroy () {

  },
  render (h) {
    return (
      <transition name='fade'>
        <div class='drop-menu-wrapper fixed flex-col' style={`top:${this.position.top}px;left:${this.position.left}px`} v-show={this.visible}>
          {
            this.menuList.map(item => {
              const { command, text } = item
              return <div class='drop-menu-item' onClick={($event) => this.handleClick($event, command)}>{text}</div>
            })
          }
        </div>
      </transition>
    )
  }
}
</script>
<style lang="scss" scoped>
.drop-menu-wrapper {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 0px 5px 3px rgba(0, 0, 0, 0.2);
}
.drop-menu-item {
  min-width: 70px;
  padding: 5px 20px;
  cursor: pointer;
  &:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
// 渐入渐出隐藏
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
