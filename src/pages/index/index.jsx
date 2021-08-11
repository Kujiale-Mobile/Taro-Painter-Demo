import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Button, Image } from "@tarojs/components";
import Card from "../../palette/card";
import Painter from "mina-painter";
import "./index.css";

const Index = () => {
  const [template, setTemplate] = useState();
  const [imagePath, setImage] = useState("");

  useEffect(() => {
    setTemplate(new Card().palette());
  }, []);

  function onImgOK(path) {
    setImage(path);
  }

  function saveImage() {
    if (imagePath) {
      Taro.saveImageToPhotosAlbum({
        filePath: imagePath,
      });
    }
  }

  return (
    <View className="index">
      <Painter
        customStyle="margin-left:40rpx"
        palette={template}
        onImgOK={onImgOK}
      />
      <Image src={imagePath} mode="aspectFill" style="height:1000rpx;width:654rpx;margin-left:48rpx;" />
      <Button className="save-button" onClick={saveImage}>
        保存
      </Button>
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "首页",
};
