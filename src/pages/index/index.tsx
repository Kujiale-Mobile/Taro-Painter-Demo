import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Block, Image, Input, Slider } from '@tarojs/components';
import Painter from 'mina-painter';
import { getTemplate } from '../../palette';
import './index.scss';
import { IView } from 'mina-painter/types/painter-taro';
import AddText from '../../assets/images/add-text.png';
import ChangeBackground from '../../assets/images/change-background.png';
import Close from '../../assets/images/close.png';
import Right from '../../assets/images/right.png';
import AlignCenter from '../../assets/images/aligncenter.png';
import AlignLeft from '../../assets/images/alignleft.png';
import AlignRight from '../../assets/images/alignright.png';
import Bold from '../../assets/images/bold.png';
import Italic from '../../assets/images/italic.png';
import Delectline from '../../assets/images/delectline.png';
import Underline from '../../assets/images/underline.png';
import Edit from '../../assets/images/edit.png';
import Fontstyle from '../../assets/images/fontstyle.png';
import Revert from '../../assets/images/revert.png';
import Recover from '../../assets/images/recover.png';

import { colors, customActionStyle, getBlankTextView, IPalette } from '../../common';

enum EditState {
  NORMAL,
  INPUT,
  SELECT_COLOR,
  TEXT,
  EDIT_TEXT,
}

interface IState {
  dancePalette?: IPalette;
  palette?: IPalette;
  action?: { view: IView };
  actionTitle: string;
  editState: EditState;
  inputValue: string;
  clearActionBox: boolean;
  selectedColor: string;
  fontStyleTab: number;
  sliderValue: number;
  textStyle: string;
  fontWeight: string;
  textAlign: string;
  textDecoration: string;
  hasRevert: boolean;
  hasRecover: boolean;
}

interface ITimeStackItem {
  view?: IView;
  palette?: IPalette;
  index?: number;
  type?: string;
}

export default class Index extends Component<any, IState> {
  config: Config = {
    navigationBarTitleText: '海报编辑器',
  };

  currentPalette: IPalette;
  currentView: IView | undefined = undefined;
  preState: EditState = EditState.NORMAL;
  preColor: string = '';
  preView: IView | undefined = undefined;
  history: ITimeStackItem[] = [];
  future: ITimeStackItem[] = [];
  state: IState = {
    actionTitle: '',
    editState: EditState.NORMAL,
    inputValue: '',
    clearActionBox: false,
    selectedColor: '',
    fontStyleTab: 0,
    sliderValue: 0,
    textStyle: 'normal',
    textAlign: 'center',
    fontWeight: 'normal',
    textDecoration: 'none',
    hasRevert: false,
    hasRecover: false,
  };

  componentWillMount() {
    Taro.showLoading({ title: '加载中' });
    this.currentPalette = getTemplate();
    this.refreshPalette();
    this.preColor = this.currentPalette.background;
    this.setState({
      selectedColor: this.currentPalette.background,
    });
  }

  refreshPalette = (palette?: IPalette) => {
    this.setState({
      dancePalette: palette || { ...this.currentPalette },
    });
  };

  refreshSelectView = (view?: IView) => {
    if (view || this.currentView) {
      this.setState({
        action: { view: view || this.currentView! },
      });
    }
  };

  clearActionBox = () => {
    this.setState(
      {
        clearActionBox: true,
      },
      () => {
        this.setState({
          clearActionBox: false,
        });
      },
    );
  };

  pushToHistory = (item: ITimeStackItem) => {
    this.future.length = 0;
    while (this.history.length > 19) {
      this.history.shift();
    }
    this.history.push(item);
    this.refreshTop();
  };

  refreshTop = () => {
    this.setState({
      hasRecover: this.future.length > 0,
      hasRevert: this.history.length > 0,
    });
  };

  handleImgOk = path => {
    Taro.hideLoading();
    Taro.saveImageToPhotosAlbum({
      filePath: path,
    })
      .then(() => {
        Taro.showToast({
          icon: 'none',
          title: '保存成功',
        });
      })
      .catch(err => {
        console.error(err);
        Taro.showToast({
          icon: 'none',
          title: '保存失败',
        });
      });
  };

  handleDidShow = () => {
    Taro.hideLoading();
  };

  handleTouchEnd = (detail: { view: IView; type: string; index: number }) => {
    if (detail.type === 'delete') {
      this.pushToHistory(JSON.parse(JSON.stringify(detail)));
      if (this.currentPalette.views[detail.index].id === detail.view.id) {
        this.currentPalette.views.splice(detail.index, 1);
      } else {
        this.currentPalette.views.splice(detail.index, 0, detail.view);
      }
      this.refreshPalette();
      this.handleClickBackground();
    } else if (!detail.view) {
      this.handleClickBackground();
    } else {
      for (let i = 0; i < this.currentPalette.views.length; i++) {
        if (this.currentPalette.views[i].id === detail.view.id) {
          this.pushToHistory({
            view: JSON.parse(JSON.stringify(this.currentPalette.views[i])),
          });
          this.currentPalette.views[i] = { ...detail.view };
          break;
        }
      }
    }
  };

  handleViewClick = (view: IView) => {
    this.currentView = view;
    if (view.type === 'text') {
      this.setState({
        editState: EditState.TEXT,
      });
    }
  };

  handleViewUpdate = (view: IView) => {};

  handleEditText = () => {
    this.preState = this.state.editState;
    const newState = {
      editState: EditState.INPUT,
      actionTitle: '编辑文字',
    };
    this.setState(newState);
  };

  handleChangeBackground = () => {
    this.preColor = this.currentPalette.background;
    this.setState({
      editState: EditState.SELECT_COLOR,
      actionTitle: '更换背景',
    });
  };

  handleActionCancel = () => {
    const { editState } = this.state;
    const newState = {
      editState: this.preState,
    };
    switch (editState) {
      case EditState.INPUT: {
        newState['inputValue'] = '';
        break;
      }
      case EditState.SELECT_COLOR: {
        if (this.currentView) {
          this.currentView.css.color = this.preColor;
          this.refreshSelectView();
        } else {
          this.currentPalette.background = this.preColor;
          this.refreshPalette();
        }
        newState['selectedColor'] = this.preColor;
      }
      case EditState.EDIT_TEXT: {
        this.currentView = this.preView;
        this.refreshSelectView();
        break;
      }
      default: {
        break;
      }
    }
    this.setState(newState);
  };

  handleActionConfirm = () => {
    const { editState, inputValue } = this.state;
    const newState = {
      editState: this.preState,
    };
    switch (editState) {
      case EditState.INPUT: {
        newState['inputValue'] = '';
        if (this.currentView && this.currentView.type === 'text') {
          this.pushToHistory({
            view: JSON.parse(JSON.stringify(this.currentView)),
          });
          this.currentView.text = inputValue;
          this.refreshSelectView();
        } else {
          this.pushToHistory({
            type: 'delete',
            index: this.currentPalette.views.length,
            view: getBlankTextView(inputValue),
          });
          this.currentPalette.views.push(getBlankTextView(inputValue));
          this.refreshPalette();
        }
        break;
      }
      case EditState.SELECT_COLOR: {
        this.pushToHistory({
          palette: JSON.parse(
            JSON.stringify({
              ...this.currentPalette,
              background: this.preColor,
            }),
          ),
        });
        break;
      }
      case EditState.EDIT_TEXT: {
        this.pushToHistory({
          view: this.preView,
        });
        break;
      }
      default: {
        break;
      }
    }
    this.setState(newState);
  };

  handleSelectColor = (color: string) => {
    this.setState({
      selectedColor: color,
    });
    if (this.currentView && this.currentView.type === 'text') {
      this.currentView.css.color = color;
      this.refreshSelectView();
    } else {
      this.currentPalette.background = color;
      this.refreshPalette();
    }
  };

  handleClickBackground = () => {
    this.currentView = undefined;
    this.setState(
      {
        editState: EditState.NORMAL,
      },
      this.clearActionBox,
    );
  };

  handleEditFontStyle = () => {
    this.preView = JSON.parse(JSON.stringify(this.currentView));
    this.preState = this.state.editState;
    this.setState({
      editState: EditState.EDIT_TEXT,
      actionTitle: '编辑样式',
      selectedColor: this.currentView!.css.color,
      sliderValue: parseInt(this.currentView!.css.fontSize),
      textStyle: this.currentView!.css.textStyle || 'normal',
      textAlign: this.currentView!.css.textAlign || 'center',
      fontWeight: this.currentView!.css.fontWeight || 'normal',
      textDecoration: this.currentView!.css.textDecoration || 'none',
    });
  };

  handleTextStyle = (options: { align?: string; weight?: string; style?: string; decoration?: string }) => {
    const { align, weight, style, decoration } = options;
    const newState = {};
    if (align) {
      if (this.currentView!.css.textAlign === align) {
        delete this.currentView!.css.textAlign;
        newState['textAlign'] = '';
      } else {
        this.currentView!.css.textAlign = align;
        newState['textAlign'] = align;
      }
    }
    if (weight) {
      if (this.currentView!.css.fontWeight === weight) {
        this.currentView!.css.fontWeight = 'normal';
        newState['fontWeight'] = 'normal';
      } else {
        this.currentView!.css.fontWeight = weight;
        newState['fontWeight'] = weight;
      }
    }
    if (style) {
      if (this.currentView!.css.textStyle === style) {
        this.currentView!.css.textStyle = 'normal';
        newState['textStyle'] = 'normal';
      } else {
        this.currentView!.css.textStyle = style;
        newState['textStyle'] = style;
      }
    }
    if (decoration) {
      if (this.currentView!.css.textDecoration === decoration) {
        this.currentView!.css.textDecoration = 'none';
        newState['textDecoration'] = 'none';
      } else {
        this.currentView!.css.textDecoration = decoration;
        newState['textDecoration'] = decoration;
      }
    }
    this.setState(newState);
    this.refreshSelectView();
  };

  handleTimeMachine = (type: 'revert' | 'recover') => {
    let popStack: ITimeStackItem[];
    let pushStack: ITimeStackItem[];
    if (type === 'revert') {
      popStack = this.history;
      pushStack = this.future;
    } else {
      pushStack = this.history;
      popStack = this.future;
    }
    const pre = popStack.pop();
    if (!pre) {
      return;
    }
    if (pre.type === 'delete') {
      this.currentView = undefined;
      if (this.currentPalette.views[pre.index!] && this.currentPalette.views[pre.index!].id === pre.view!.id) {
        this.currentPalette.views.splice(pre.index!, 1);
      } else {
        this.currentPalette.views.splice(pre.index!, 0, pre.view!);
      }
      pushStack.push(pre);
      this.refreshPalette();
    } else if (pre.palette) {
      pushStack.push({
        palette: JSON.parse(JSON.stringify(this.currentPalette)),
      });
      this.currentPalette = pre.palette;
      this.currentView = undefined;
      this.refreshPalette();
    } else {
      for (let i = 0; i < this.currentPalette.views.length; i++) {
        if (this.currentPalette.views[i].id === pre.view!.id) {
          pushStack.push({
            view: JSON.parse(JSON.stringify(this.currentPalette.views[i])),
          });
          this.currentPalette.views[i] = pre.view!;
          this.currentView = this.currentPalette.views[i];
          this.refreshSelectView(pre.view);
          break;
        }
      }
    }
    this.setState({
      editState: this.currentView && this.currentView.type === 'text' ? EditState.TEXT : EditState.NORMAL,
    });
    this.refreshTop();
  };

  handleSaveImage = () => {
    Taro.showLoading({
      title: '生成中',
    });
    this.setState({
      palette: JSON.parse(JSON.stringify(this.currentPalette)),
    });
  };

  renderBottom = () => {
    const { editState } = this.state;
    return (
      <View className="page__bottom" style={editState === EditState.NORMAL ? { bottom: 0 } : {}}>
        <View className="page__bottom__block" onClick={this.handleEditText}>
          <Image src={AddText} className="page__bottom__block__icon" mode="aspectFill" />
          <Text className="page__bottom__block__text">+文字</Text>
        </View>
        <View className="page__bottom__block" onClick={this.handleChangeBackground}>
          <Image src={ChangeBackground} className="page__bottom__block__icon" mode="aspectFill" />
          <Text className="page__bottom__block__text">背景</Text>
        </View>
      </View>
    );
  };

  renderActions = () => {
    const { actionTitle } = this.state;
    return (
      <View className="page__bottom__action">
        <Image onClick={this.handleActionCancel} src={Close} className="page__bottom__action__icon" mode="aspectFill" />
        <Text className="page__bottom__action__title">{actionTitle}</Text>
        <Image
          onClick={this.handleActionConfirm}
          src={Right}
          className="page__bottom__action__icon"
          mode="aspectFill"
        />
      </View>
    );
  };

  renderInputText = () => {
    const { editState, inputValue } = this.state;
    return (
      <View className="page__bottom--column" style={editState === EditState.INPUT ? { bottom: 0 } : {}}>
        <Input
          onInput={({ detail }) => {
            this.setState({
              inputValue: detail.value,
            });
          }}
          value={inputValue}
          placeholder="请输入"
          className="page__bottom__input"
        />
        {this.renderActions()}
      </View>
    );
  };

  renderSelectColor = () => {
    const { editState, selectedColor } = this.state;
    return (
      <View className="page__bottom--column" style={editState === EditState.SELECT_COLOR ? { bottom: 0 } : {}}>
        <View className="page__bottom__color__list">
          {colors.map(color => (
            <View
              key="color"
              className="page__bottom__color"
              style={{ backgroundColor: color, border: selectedColor === color ? '4rpx solid #1A7AF8' : 'none' }}
              onClick={() => this.handleSelectColor(color)}
            />
          ))}
        </View>
        {this.renderActions()}
      </View>
    );
  };

  renderTextActions = () => {
    const { editState } = this.state;
    return (
      <View className="page__bottom" style={editState === EditState.TEXT ? { bottom: 0 } : {}}>
        <View className="page__bottom__block" onClick={this.handleEditText}>
          <Image src={Edit} className="page__bottom__block__icon" mode="aspectFill" />
          <Text className="page__bottom__block__text">编辑文字</Text>
        </View>
        <View className="page__bottom__block" onClick={this.handleEditFontStyle}>
          <Image src={Fontstyle} className="page__bottom__block__icon" mode="aspectFill" />
          <Text className="page__bottom__block__text">编辑样式</Text>
        </View>
      </View>
    );
  };

  renderFontStyle = () => {
    const {
      editState,
      fontStyleTab,
      selectedColor,
      sliderValue,
      textAlign,
      textDecoration,
      textStyle,
      fontWeight,
    } = this.state;
    return (
      <View
        className="page__bottom--column"
        style={editState === EditState.EDIT_TEXT ? { bottom: 0, height: '360rpx' } : {}}>
        <View className="fontstyle">
          <View className="fontstyle__tab">
            {['大小', '颜色', '格式'].map((tab, index) => {
              return (
                <View
                  className="fontstyle__tab__item"
                  key="tab"
                  style={fontStyleTab === index ? { color: '#000' } : {}}
                  onClick={() => {
                    this.setState({
                      fontStyleTab: index,
                    });
                  }}>
                  {tab}
                </View>
              );
            })}
          </View>
          <View className="fontstyle__block">
            {fontStyleTab === 0 && (
              <Block>
                <Slider
                  className="fontstyle__progress"
                  value={sliderValue}
                  max={80}
                  min={20}
                  showValue
                  onChange={({ detail }) => {
                    if (this.currentView!.css.lineHeight) {
                      this.currentView!.css.lineHeight = `${parseInt(this.currentView!.css.lineHeight) -
                        parseInt(this.currentView!.css.fontSize) +
                        detail.value}rpx`;
                    }
                    this.currentView!.css.fontSize = `${detail.value}rpx`;
                    this.refreshSelectView();
                  }}
                />
              </Block>
            )}
            {fontStyleTab === 1 && (
              <Block>
                <View className="page__bottom__color__list">
                  {colors.map(color => (
                    <View
                      key="color"
                      className="page__bottom__color"
                      style={{
                        backgroundColor: color,
                        border: selectedColor === color ? '4rpx solid #1A7AF8' : 'none',
                      }}
                      onClick={() => this.handleSelectColor(color)}
                    />
                  ))}
                </View>
              </Block>
            )}
            {fontStyleTab === 2 && (
              <Block>
                <Image
                  className="fontstyle__item"
                  src={Delectline}
                  style={textDecoration === 'line-through' ? { opacity: 1 } : {}}
                  onClick={() => this.handleTextStyle({ decoration: 'line-through' })}
                />
                <Image
                  className="fontstyle__item"
                  src={Underline}
                  style={textDecoration === 'underline' ? { opacity: 1 } : {}}
                  onClick={() => this.handleTextStyle({ decoration: 'underline' })}
                />
                <View className="fontstyle__item__divide"></View>
                <Image
                  className="fontstyle__item"
                  src={AlignLeft}
                  style={textAlign === 'left' ? { opacity: 1 } : {}}
                  onClick={() => this.handleTextStyle({ align: 'left' })}
                />
                <Image
                  className="fontstyle__item"
                  src={AlignCenter}
                  style={textAlign === 'center' ? { opacity: 1 } : {}}
                  onClick={() => this.handleTextStyle({ align: 'center' })}
                />
                <Image
                  className="fontstyle__item"
                  src={AlignRight}
                  style={textAlign === 'right' ? { opacity: 1 } : {}}
                  onClick={() => this.handleTextStyle({ align: 'right' })}
                />
                <View className="fontstyle__item__divide"></View>
                <Image
                  className="fontstyle__item"
                  src={Bold}
                  style={fontWeight === 'bold' ? { opacity: 1 } : {}}
                  onClick={() => this.handleTextStyle({ weight: 'bold' })}
                />
                <Image
                  className="fontstyle__item"
                  src={Italic}
                  style={textStyle === 'italic' ? { opacity: 1 } : {}}
                  onClick={() => this.handleTextStyle({ style: 'italic' })}
                />
              </Block>
            )}
          </View>
        </View>
        {this.renderActions()}
      </View>
    );
  };

  render() {
    const { dancePalette, palette, action, clearActionBox, hasRevert, hasRecover } = this.state;
    return (
      <View className="page__bg">
        <View className="bg" onClick={this.handleClickBackground} />
        <View className="top">
          <View
            className="top__block"
            style={hasRevert ? {} : { opacity: '0.3' }}
            onClick={() => this.handleTimeMachine('revert')}>
            <Image src={Revert} className="top__block__icon" mode="aspectFill" />
            <Text>撤销</Text>
          </View>
          <View
            className="top__block"
            style={hasRecover ? {} : { opacity: '0.3' }}
            onClick={() => this.handleTimeMachine('recover')}>
            <Image src={Recover} className="top__block__icon" mode="aspectFill" />
            <Text>恢复</Text>
          </View>
          <View className="top__button" onClick={this.handleSaveImage}>
            保存
          </View>
        </View>
        <Painter
          customStyle={`margin-top:1vh;`}
          customActionStyle={customActionStyle}
          dancePalette={dancePalette}
          palette={palette}
          action={action}
          clearActionBox={clearActionBox}
          disableAction={false}
          onImgOK={this.handleImgOk}
          onDidShow={this.handleDidShow}
          onTouchEnd={this.handleTouchEnd}
          onViewClicked={this.handleViewClick}
          onViewUpdate={this.handleViewUpdate}
        />
        {this.renderBottom()}
        {this.renderInputText()}
        {this.renderSelectColor()}
        {this.renderTextActions()}
        {this.renderFontStyle()}
      </View>
    );
  }
}
