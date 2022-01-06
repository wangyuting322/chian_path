<script>
export default {
  name: 'Arrow',
  components: {

  },
  props: {
    /**
     * 当前节点
     */
    current: {
      type: Object,
      default: () => ({
        rowSpan: 3
      })
    },
    /**
     * 每一个方块的高度
     */
    boxHeight: {
      type: Number,
      default: 50
    },
    /**
     * 当前所有列
     */
    col: {
      type: Array,
      default: () => []
    },
    /**
     * 当前节点在列中的index索引值
     */
    rowIndex: {
      type: Number
    },
    /**
     * 下一列
     */
    nextCol: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  computed: {
    /**
     * 两列之间的间隔 - x
     */
    distance () {
      return 50
    }
  },
  methods: {

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
      <div class={'relative arrow-wrapper'} style={`width:${this.distance}px;height:${this.boxHeight * this.current.rowSpan}px`}>
        {
          new Array(this.current.next.length).fill(null).map((item, index) => {
            const nextRowIndex = this.nextCol.findIndex(it => it.id == this.current.next[index].id) || 0
            const rightOtherHeight = this.nextCol.reduce((pre, next, nextIndex) => {
              if (nextIndex < nextRowIndex) {
                return pre + next.rowSpan * this.boxHeight
              } else {
                return pre
              }
            }, 0)
            const rightSelfHeight = rightOtherHeight + (this.current.next[index].rowSpan || 1) * this.boxHeight / 2
            const leftOtherHeight = this.col.reduce((pre, next, nextIndex) => {
              if (nextIndex < this.rowIndex) {
                return pre + next.rowSpan * this.boxHeight
              } else {
                return pre
              }
            }, 0)

            const leftSelfHeight = this.current.rowSpan * this.boxHeight
            // 求y
            const y = (leftOtherHeight + leftSelfHeight / 2 - rightSelfHeight)
            // 求x
            const x = this.distance
            // 求线长
            const lineLength = Math.sqrt((Math.pow(y, 2) + Math.pow(x, 2)))
            // 求角度
            const deg = -Math.atan(y / x) / (Math.PI / 180)
            return (
              <div class={'absolute top50 line'} style={`transform:rotate(${deg}deg);width:${lineLength}px`}></div>
            )
          })
        }
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.line {
  height: 2px;
  background-color: black;
  transform-origin: left;
  display: flex;
  align-items: center;
  justify-content: end;
  &::before {
    content: "";
    width: 0px;
    height: 0px;
    border: 5px solid black;
    border-color: rgba(0, 0, 0,0) rgba(0, 0, 0,1) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    display: block;
    transform: rotate(180deg) translateX(-5px);
  }
}
.arrow-wrapper {
  // width:50px;
}
.top50{
   top: 50%;
}
.box {
  width: 100px;
  height: 50px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  // margin: 20px;
}
.height250 {
  height: 250px;
}
.width60 {
  // width: 200px;
}
</style>
