<script>
import { cloneDeep } from 'lodash'

// 根据节点元素的高度来进行位置判断 - 更灵活
export default {
  name: 'Arrow3',
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
     * 当前列的列index
     */
    colIndex: {
      type: Number
    },
    /**
     * 当前节点在列中的index索引值
     */
    rowIndex: {
      type: Number
    },
    /**
     * 下一列 - 即指向的右侧节点所在的列
     */
    nextCol: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      cacheNext: null
    }
  },
  computed: {
    /**
     * 两列之间的间隔 - x
     */
    distance () {
      return 50
    },
    /**
     * 当前左侧节点的数据
     */
    cacheCurrent () {
      const current = cloneDeep(this.current)
      return current
    }
  },
  methods: {
    getArrow (rightArr) {
      this.$nextTick(() => {
        // 获取父元素
        const wrapper = document.querySelector('.chain-path-column')

        this.cacheNext = rightArr.map((item, index) => {
          // 获取右侧指向的节点的index
          const nextRowIndex = this.nextCol.findIndex(it => it.id == item.id) || 0
          // 获取当前元素
          const current = document.querySelector(`.mark${this.colIndex}${this.rowIndex}`)
          // 获取右侧元素
          const next = document.querySelector(`.mark${this.colIndex + 1}${nextRowIndex}`)
          // 获取右侧指向的节点上方的所有节点的高度
          const rightOtherHeight = next.offsetTop - wrapper.offsetTop
          // 获取右侧指向的节点上方的所有节点的高度以及自身高度的一半
          const rightSelfHeight = rightOtherHeight + next.offsetHeight / 2
          // 获取左侧当前节点上方的所有节点的高度
          const leftOtherHeight = current.offsetTop - wrapper.offsetTop
          // 获取左侧自身高度
          const leftSelfHeight = current.offsetHeight
          // 求y
          const y = (leftOtherHeight + leftSelfHeight / 2 - rightSelfHeight)
          // 求x
          const x = this.distance
          // 求线长
          const lineLength = Math.sqrt((Math.pow(y, 2) + Math.pow(x, 2)))
          // 求角度
          const deg = -Math.atan(y / x) / (Math.PI / 180)
          item.lineLength = lineLength
          item.deg = deg
          return item
        })
      })
    }
  },
  watch: {
    current: {
      handler (newV) {
        const rightArr = cloneDeep(this.current.next)
        this.getArrow(rightArr)
      },
      immediate: true,
      depp: true
    }
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
          this.cacheNext.map(item => {
            const { deg, lineLength } = item
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
