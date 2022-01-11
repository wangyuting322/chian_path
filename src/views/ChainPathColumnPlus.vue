<script>
// 组件
import Arrow from '@/components/service/Arrow.vue'
import DropMenu from '@/components/service/DropMenu.vue'

// 方法
import { cloneDeep } from 'lodash'

export default {
  name: 'ChainPathColumnPlus',
  components: {
    Arrow,
    DropMenu
  },
  data () {
    return {
      /**
       * 业务流图
       */
      value: [
        [{ id: 'adapter-1', name: 'adapter01', type: 'in-adapter', nextMark: ['exchange-1'] }, { id: 'adapter-2', name: 'adapter02', type: 'in-adapter', nextMark: ['exchange-1'] }, { id: 'adapter-3', name: 'adapter03', type: 'in-adapter', nextMark: ['exchange-1'] }, { id: 'adapter-4', name: 'adapter04', type: 'in-adapter', nextMark: ['exchange-2'] }],
        [{ id: 'exchange-1', name: 'exchange1', type: 'exchange', nextMark: ['queue-1', 'queue-2', 'queue-3', 'queue-4'] }, { id: 'exchange-2', name: 'exchange2', type: 'exchange', nextMark: [] }],
        [{ id: 'queue-1', name: 'queue01', type: 'queue', nextMark: ['adapter-5'] }, { id: 'queue-2', name: 'queue02', type: 'queue', nextMark: ['adapter-5'] }, { id: 'queue-3', name: 'queue03', type: 'queue', nextMark: ['adapter-5'] }, { id: 'queue-4', name: 'queue04', type: 'queue', nextMark: [] }],
        [{ id: 'adapter-5', name: 'adapter05', type: 'out-adapter', nextMark: ['2'] }]
      ],
      /**
       * 当前选中的节点
       */
      activeInfo: null,
      /**
       * 是否显示下拉菜单
       */
      showDropMenu: false,
      /**
       * 下拉菜单的位置
       */
      dropMenuPosition: {
        left: 0,
        top: 0
      },
      /**
       * 下拉菜单的列表
       */
      dropMenuList: [],
      /**
       * 当前拖拽的节点
       */
      dragNode: null
    }
  },
  computed: {
    /**
     * 每一个方块的高度
     */
    boxHeight () {
      return 50
    },
    /**
     * 每一个方块的margin-top - 默认marginTop和margin-Bottom相同
     */
    boxMargin () {
      return 5
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
          // const nextRowSpan = row.next.reduce((pre, next, index) => {
          //   return pre + (next.rowSpan || 1)
          // }, 0)
          // row.rowSpan = Math.max(preRowSpan, nextRowSpan)
          row.rowSpan = Math.max(row.previous.length, row.nextMark.length, 1)
          // row.rowSpan = Math.max(row.previous.length, nextRowSpan)
          // row.rowSpan = 1
        })
      })
      return cacheValue
    }
  },
  methods: {
    /**
     * 取消高亮
     */
    cancelactiveInfo (e) {
      if (e.target._prevClass !== 'no-show-cont') {
        this.activeInfo = null
      }
      this.showDropMenu = false
    },
    /**
     * box右键弹出菜单
     */
    onContextmenu (event, { col, colIndex, row, rowIndex }) {
      event.preventDefault()
      // 不是空白处右键
      if (row.type !== 'system') {
        this.activeInfo = {
          col, colIndex, row, rowIndex
        }
        event.cancelBubble = true
      } else {
        this.activeInfo = null
      }
      this.getMenuDrop(row)
      this.dropMenuPosition = {
        left: event.clientX,
        top: event.clientY
      }
      this.showDropMenu = true
    },
    /**
     * 鼠标拖拽节点
     */
    handleUp (event, params) {
      const { col, colIndex, row, rowIndex } = params
      // 左键的鼠标松开 - 拖拽结束
      if (event.button == 0 && this.dragNode) {
        if (params) {
          // 拖拽到box节点上

        } else {
          // 拖拽到空白处
        }
      }
    },
    /**
     * 获取新增加的节点的摆放位置 - rowIndex
     */
    getLastNode (colIndex, rowIndex) {
      if (rowIndex === this.value[colIndex].length - 1) {
        // 当前节点是当前列的最后一行，则指向节点添加在下一列的最后
        return this.value[colIndex + 1] ? this.value[colIndex + 1].length : 0
      } else {
        const current = this.value[colIndex][rowIndex]
        const index = this.value[colIndex + 1].findIndex(it => it.id === current.nextMark[current.nextMark.length - 1])
        if (index < 0) {
          return this.getLastNode(colIndex, rowIndex - 1)
        } else {
          return index + 1
        }
      }
    },
    /**
     * 添加节点
     */
    addNode (node) {
      // 点击box添加节点
      if (this.activeInfo) {
        const { col, colIndex, row, rowIndex } = this.activeInfo
        // 在下一列中添加节点 - 判断位置
        const lastIndex = this.getLastNode(colIndex, rowIndex)
        this.value[colIndex + 1].splice(lastIndex, 0, node)
        // 在当前节点的nextMark中添加
        // 修改current的指针，触发arrow组件的current的监听
        const current = cloneDeep(this.value[colIndex][rowIndex])
        current.nextMark.push(node.id)
        this.value[colIndex][rowIndex] = current
      } else {
        // 点击空白处添加节点 - 添加起始节点
        this.value[0].push(node)
      }
    },
    /**
     * 去除节点
     */
    removeNode () {
      const { col, colIndex, row, rowIndex } = this.activeInfo
      // 去除当前列中的此节点
      this.value[colIndex].splice(rowIndex, 1)
      if (colIndex !== 0) {
        // 修改上一列中包含次节点的nextMark
        this.value[colIndex - 1] = this.value[colIndex - 1].map(item => {
          // 修改current的指针，触发arrow组件的current的监听
          const cacheItem = cloneDeep(item)
          cacheItem.nextMark = item.nextMark.filter(it => it !== row.id)
          return cacheItem
        })
      }
    },
    /**
     * 处理菜单的选项的点击事件
     */
    handleCommand (e) {
      // 点击每个box
      const { col, colIndex, row, rowIndex } = this.activeInfo
      if (e === 'bindExchange' && row.type === 'in-adapter') {
        const num = Math.random()
        this.addNode({ id: 'exchange-' + num, name: 'exchange-' + num, type: 'exchange', nextMark: [] })
      } else if (e === 'cancelBind' && row.type === 'exchange') {
        this.removeNode()
      } else if (e === 'bindAdapter') {
        // 点击空白处
        this.addNode({ id: 'adapter-' + Math.random(), name: 'adapter' + Math.random(), type: 'in-adapter', nextMark: [] })
      }
    },
    /**
     * 获取每一种类型的节点的下拉菜单 - 包括空白处
     */
    getMenuDrop (row) {
      let menu = null
      switch (row.type) {
        case 'in-adapter':
          menu = [
            {
              command: 'bindExchange',
              text: '绑定交换机'
            }
          ]
          break
        case 'out-adapter':
          menu = []
          break
        case 'exchange':
          menu = [
            {
              command: 'bindQueue',
              text: '绑定队列'
            }
          ]
          break
        case 'queue':
          menu = [
            {
              command: 'bindAdapter',
              text: '绑定适配器'
            }
          ]
          break
        case 'system':
          menu = [
            {
              command: 'bindAdapter',
              text: '绑定适配器'
            },
            {
              command: 'bindExchange',
              text: '绑定交换机'
            },
            {
              command: 'cancelAllBind',
              text: '解除所有绑定'
            }
          ]
          break

        default:
          menu = []
          break
      }
      // 无下一个节点时，可以解除绑定
      if (!(row.next && row.next.length) && row.type !== 'system') {
        menu.unshift(
          {
            command: 'cancelBind',
            text: '解除绑定'
          }
        )
      }
      this.dropMenuList = menu
    },
    /**
     * 按照列来绘制
     */
    renderCol () {
      return this.colArr.map((col, colIndex) => {
        return (
          <div class='flex-col'>
            {
              col.map((row, rowIndex) => {
                // 计算高度 - 减去1px高度的Drop标识
                const height = ((this.boxHeight + 2 * this.boxMargin) * row.rowSpan) - (2 * (this.boxMargin)) - 1
                const params = { col, colIndex, row, rowIndex }
                return (
                  <div class='flex-row border-box'>
                    {/** 渲染box */}
                    <div class={`box pointer border-box mark${colIndex}${rowIndex} ${this.activeInfo && this.activeInfo.row.id === row.id ? 'active-box' : ''}`}
                      id={`mark${colIndex}${rowIndex}`}
                      style={`height:${height}px;margin:${this.boxMargin}px`}
                      onContextmenu={($event) => this.onContextmenu($event, params)} onMouseup={($event) => this.handleUp($event, params)}>
                      {row.name}
                    </div>
                    {
                      /** 渲染box右侧的箭头 */
                      row.next && row.next.length ? (
                        <Arrow boxHeight={this.boxHeight} boxMargin={this.boxMargin} current={row} col={col} colIndex={colIndex} rowIndex={rowIndex} nextCol={this.colArr[colIndex + 1]}></Arrow>
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
      <div class='wrapper flex-row chain-path-column p20' onClick={this.cancelactiveInfo} onContextmenu={($event) => this.onContextmenu($event, { row: { type: 'system' } })} onMouseup={($event) => this.handleUp($event)}>
        {
          this.renderCol()
        }
        <DropMenu v-model={this.showDropMenu} menuList={this.dropMenuList} position={this.dropMenuPosition} onCommand={this.handleCommand}></DropMenu>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100vw;
  align-items: stretch;
  background-color: #fff;
}
.box {
  width: 100px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}
.active-box {
  transform: scale(1.03);
  box-shadow: 0 0px 5px 3px rgba(0, 0, 0, 0.2);
}
.height250 {
  height: 250px;
}
</style>
