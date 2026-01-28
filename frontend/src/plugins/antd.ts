import type { App } from 'vue'
import {
  Button,
  Input,
  Form,
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Avatar,
  Dropdown,
  Badge,
  Progress,
  Tabs,
  Space,
  Divider,
  Checkbox,
  Spin,
  Alert,
  Empty,
  message,
  notification
} from 'ant-design-vue'

// 导入样式
import 'ant-design-vue/dist/reset.css'

export default function setupAntd(app: App) {
  app.use(Button)
  app.use(Input)
  app.use(Form)
  app.use(Layout)
  app.use(Menu)
  app.use(Card)
  app.use(Row)
  app.use(Col)
  app.use(Avatar)
  app.use(Dropdown)
  app.use(Badge)
  app.use(Progress)
  app.use(Tabs)
  app.use(Space)
  app.use(Divider)
  app.use(Checkbox)
  app.use(Spin)
  app.use(Alert)
  app.use(Empty)

  // 全局配置
  app.config.globalProperties.$message = message
  app.config.globalProperties.$notification = notification
}
