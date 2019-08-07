import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import Card from '../../palette/card'
import './index.css'

let imagePath = ''

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      'painter': '/components/painter/painter'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      template: {},
    }
  }

  componentDidMount() {
    this.setState({
      template: new Card().palette()
    })
  }

  onImgOK(e) {
    imagePath = e.detail.path;
    console.log(e);
  }

  saveImage() {
    Taro.saveImageToPhotosAlbum({
      filePath: imagePath,
    });
  }

  render() {
    return (
      <View className='index'>
        <painter customStyle='margin-left:40rpx' palette={this.state.template} onImgOK={this.onImgOK} />
        <Button className='save-button' onClick={this.saveImage}>保存</Button>
      </View>
    )
  }
}