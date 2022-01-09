<script>
// 组件
import Arrow2 from '@/components/common/Arrow2.vue'

export default {
  name: 'ChainPathColumn',
  data () {
    return {
      value: [
        [{ id: '1', name: '业务系统', nextMark: ['adapter-1', 'adapter-2', 'adapter-3', 'adapter-4'] }],
        [{ id: 'adapter-1', name: 'adapter01', nextMark: ['exchange-1'] }, { id: 'adapter-2', name: 'adapter02', nextMark: ['exchange-1'] }, { id: 'adapter-3', name: 'adapter03', nextMark: ['exchange-1'] }, { id: 'adapter-4', name: 'adapter04', nextMark: ['exchange-2'] }],
        [{ id: 'exchange-1', name: 'exchange1', nextMark: ['queue-1', 'queue-2', 'queue-3', 'queue-4'] }, { id: 'exchange-2', name: 'exchange2', nextMark: [] }],
        [{ id: 'queue-1', name: 'queue01', nextMark: ['spq-1'] }, { id: 'queue-2', name: 'queue02', nextMark: ['spq-1'] }, { id: 'queue-3', name: 'queue03', nextMark: ['spq-1'] }, { id: 'queue-4', name: 'queue04', nextMark: [] }],
        [{ id: 'spq-1', name: '适配器', nextMark: ['2'] }],
        [{ id: '2', name: '业务系统2', nextMark: [] }]
      ]
    }
  },
  components: {
    Arrow2
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
      const cacheValue = [...this.value]
      cacheValue.forEach((col, colIndex) => {
        col.forEach((row, rowIndex) => {
          row.previous = colIndex ? cacheValue[colIndex - 1].filter(item => item.nextMark.includes(row.id)) : []
          row.next = row.nextMark.length && colIndex < cacheValue.length - 1 ? cacheValue[colIndex + 1].filter(item => row.nextMark.includes(item.id)) : []
          // const preRowSpan = row.previous.reduce((pre, next, index) => {
          //     return pre + (next.rowSpan||1)
          //   }, 0)
          const nextRowSpan = row.next.reduce((pre, next, index) => {
            return pre + (next.rowSpan || 1)
          }, 0)
          // row.rowSpan = Math.max(preRowSpan, nextRowSpan)
          // row.rowSpan = Math.max(row.previous.length, row.nextMark.length)
          row.rowSpan = Math.max(row.previous.length, nextRowSpan)
          // row.rowSpan = 1
        })
      })
      return cacheValue
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
                        <Arrow2 boxHeight={this.boxHeight} current={row} col={col} rowIndex={rowIndex} nextCol={this.colArr[colIndex + 1]}></Arrow2>
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
      <div class='wrapper flex-row chain-path-column'>
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
  // margin: 20px;
}
.height250 {
  height: 250px;
}
.width60{
  // width: 200px;
}

</style>
