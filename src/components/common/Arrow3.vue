<script>
import { cloneDeep } from 'lodash'

// 根据节点元素的高度进行箭头的旋转角度，长度等
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
     * 每一个方块的margin
     */
    boxMargin: {
      type: Number,
      default: 0
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
        // 200ms的延迟用于给box的transition过渡时间
        setTimeout(() => {
        // 获取父元素
          const wrapper = document.querySelector('.chain-path-column')

          this.cacheNext = rightArr.map((item, index) => {
          // 获取右侧指向的节点的index
            const nextRowIndex = this.nextCol.findIndex(it => it.id == item.id) || 0
            // 获取当前元素
            const current = document.querySelector(`#mark${this.colIndex}${this.rowIndex}`)
            // 获取右侧元素
            const next = document.querySelector(`#mark${this.colIndex + 1}${nextRowIndex}`)
            // 获取右侧指向的节点上方的所有节点的高度
            const rightOtherHeight = next.offsetTop - wrapper.offsetTop
            // 获取右侧指向的节点上方的所有节点的高度以及自身高度的一半
            const rightSelfHeight = rightOtherHeight + (next.clientHeight) / 2
            // 获取左侧当前节点上方的所有节点的高度
            const leftOtherHeight = current.offsetTop - wrapper.offsetTop
            // 获取左侧自身高度
            const leftSelfHeight = current.clientHeight
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
        }, 200)
      })
    }
  },
  watch: {
    current: {
      handler (newV) {
        if (newV) {
          const rightArr = cloneDeep(newV.next)
          this.getArrow(rightArr)
        } else {
          this.cacheNext = null
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {

  },
  mounted () {

  },
  beforeDestroy () {

  },
  render (h) {
    const height = (2 * this.boxMargin + this.boxHeight) * this.current.rowSpan
    return (
      <div class={'relative arrow-wrapper'} style={`width:${this.distance}px;height:${height}px`}>
        {
          this.cacheNext && this.cacheNext.map(item => {
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
  transition: all 0.2s;
  &::before {
    content: "";
    width: 0px;
    height: 0px;
    border: 5px solid black;
    border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0,1) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    display: block;
    transform: rotate(180deg) translateX(-6px);
  }
}
.top50{
   top: 50%;
}
</style>
