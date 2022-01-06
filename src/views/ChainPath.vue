<script>
// 组件
import Arrow from '@/components/common/Arrow.vue'

// value为每一条链路的数组 - 只能展示，无法新增（数据格式不支持）
export default {
  name: 'ChainPath',
  data () {
    return {
      value: [
        [
          { id: 1, name: '业务系统' },
          { id: 2, name: 'adapter01' },
          { id: 3, name: 'exchange' },
          { id: 4, name: 'queue01' },
          { id: 9, name: '适配器' },
          { id: 10, name: '业务系统2' }
        ],
        [
          { id: 1, name: '业务系统' },
          { id: 5, name: 'adapter02' },
          { id: 3, name: 'exchange' },
          { id: 6, name: 'queue02' },
          { id: 9, name: '适配器' }
        ],
        [{ id: 1, name: '业务系统' },
          { id: 7, name: 'adapter03' },
          { id: 3, name: 'exchange' },
          { id: 8, name: 'queue03' }
        ]
      ]
    }
  },
  components: {
    Arrow
  },
  computed: {
    /**
     * 每一个方块的高度
     */
    boxHeight () {
      return 50
    },
    /**
     * 每一列的数据的数组
     */
    colArr () {
      const arr = []
      this.value.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
        // 第一行
          if (!rowIndex) {
            arr[colIndex] = []
          }
          // 寻找是否每一列存在相同的节点
          const res = arr[colIndex].find(item => item.id === col.id)
          // 找到不一样的
          if (!res) {
            // 获取当前节点的下一个节点的数据
            const next = []
            if (colIndex < row.length - 1) {
              // 不是最后一列，则获取关联的下一个节点
              let cacheNext
              // 第一行，则直接获取下一个节点
              if (!rowIndex) {
                cacheNext = row[colIndex + 1]
              } else {
                // 不是第一行，去arr的下一列中找是否有重复的下一个节点(保持对象指针相同)
                const sameNext = arr[colIndex + 1].find(it => it.id === row[colIndex + 1].id)
                cacheNext = sameNext || row[colIndex + 1]
              }
              next.push(cacheNext)
            }
            col.rowSpan = 1
            col.next = next
            arr[colIndex].push(col)
          } else {
            // 找到一样的，rowSpan++
            res.rowSpan++
            // next push
            if (colIndex < row.length - 1) {
              // 不是最后一列，则获取下一个节点
              res.next.push(row[colIndex + 1])
            }
          }
        })
      })
      return arr
    }
  },
  methods: {
    /**
     * 按照列来绘制
     */
    renderCol () {
      return this.colArr.map((col, colIndex) => {
        return (
          <div class='flex-col'>
            {
              col.map((row, rowIndex) => {
                return (
                  <div class='flex-row'>
                    <div class={`box mark${colIndex}${rowIndex}`} id={`mark${colIndex}${rowIndex}`} style={`height:${this.boxHeight * row.rowSpan}px`}>{row.name}</div>
                    {
                      row.next && row.next.length ? (
                        <Arrow boxHeight={this.boxHeight} current={row} col={col} rowIndex={rowIndex} nextCol={this.colArr[colIndex + 1]}></Arrow>
                      ) : null
                    }

                  </div>
                )
              })
            }
          </div>
        )
      })
    }
  },
  render (h) {
    return (
      <div class='wrapper flex-row'>
        {
          this.renderCol()
        }
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  width: 100vw;
}
.box {
  width: 100px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
