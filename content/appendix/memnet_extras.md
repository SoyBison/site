---
title: "Memnet Extras"
date: 2020-10-24T15:36:17-05:00
draft: false
---

## MemNet

```{python}
class MemNet(nn.Module):
    def __init__(self):
        super(MemNet, self).__init__()
        self.relu = nn.ReLU()
        self.conv1 = nn.Conv2d(3, 48, kernel_size=(11, 11), stride=(4, 4))
        self.pool1 = nn.MaxPool2d(kernel_size=3, stride=2,
                                    padding=0, dilation=1, ceil_mode=False)
        self.lrn1 = nn.LocalResponseNorm(5, alpha=1e-4, beta=0.75, k=1.0)
        self.conv2 = nn.Conv2d(48, 256, kernel_size=(5, 5),
                                stride=(1, 1), padding=(2, 2), groups=2)
        self.pool2 = nn.MaxPool2d(kernel_size=3, stride=2,
                                    padding=0, dilation=1, ceil_mode=False)
        self.lrn2 = nn.LocalResponseNorm(5, alpha=1e-4, beta=0.75, k=1.0)
        self.conv3 = nn.Conv2d(256, 384, kernel_size=(3, 3),
                                stride=(1, 1), padding=(1, 1), groups=2)
        self.conv4 = nn.Conv2d(384, 384, kernel_size=(3, 3),
                                stride=(1, 1), padding=(1, 1), groups=2)
        self.conv5 = nn.Conv2d(384, 256, kernel_size=(3, 3),
                                stride=(1, 1), padding=(1, 1), groups=2)
        self.pool5 = nn.MaxPool2d(kernel_size=3, stride=2,
                                    padding=0, dilation=1, ceil_mode=False)

        self.fc6 = nn.Linear(in_features=9216, out_features=4096, bias=True)
        self.drp6 = nn.Dropout(p=0.5, inplace=False)
        self.fc7 = nn.Linear(in_features=4096, out_features=4096, bias=True)
        self.drp7 = nn.Dropout(p=0.5, inplace=False)
        self.fc8 = nn.Linear(in_features=4096, out_features=1, bias=True)

        self.lamem_train = []
        self.lamem_test = []
        self.lamem_val = []

    def forward(self, x):
        cnv = self.relu(self.conv1(x))
        cnv = self.pool1(cnv)
        cnv = self.lrn1(cnv)
        cnv = self.relu(self.conv2(cnv))
        cnv = self.pool2(cnv)
        cnv = self.lrn2(cnv)
        cnv = self.relu(self.conv3(cnv))
        cnv = self.relu(self.conv4(cnv))
        cnv = self.relu(self.conv5(cnv))
        cnv = self.pool5(cnv)
        feat = cnv.view(-1, 9216)
        hid = self.relu(self.fc6(feat))
        hid = self.drp6(hid)
        hid = self.relu(self.fc7(hid))
        pry = self.fc8(hid)

        return pry
```


## ResMem

```{python}
class ResMem(nn.Module):
    def __init__(self, learning_rate=1e-5,  momentum=.9, cruise_altitude=384):
        super().__init__()

        self.features = resnet152(pretrained=True)

        self.conv1 = nn.Conv2d(3, 48, kernel_size=11, stride=4)
        self.pool1 = nn.MaxPool2d(3, 2)
        self.lrn1 = nn.LocalResponseNorm(5)
        self.conv2 = nn.Conv2d(48, 256, kernel_size=5, stride=1, padding=2, groups=2)
        self.pool2 = nn.MaxPool2d(3, 2)
        self.lrn2 = nn.LocalResponseNorm(5)
        self.conv3 = nn.Conv2d(256, cruise_altitude, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1), groups=2)
        self.conv4 = nn.Conv2d(cruise_altitude, cruise_altitude, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1), groups=2)
        self.conv5 = nn.Conv2d(cruise_altitude, 256, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1), groups=2)
        self.pool5 = nn.MaxPool2d(kernel_size=3, stride=2, padding=0, dilation=1, ceil_mode=False)



        self.fc6 = nn.Linear(in_features=9216 + 1000, out_features=4096, bias=True)
        self.drp6 = nn.Dropout(p=0.5, inplace=False)
        self.fc7 = nn.Linear(in_features=4096, out_features=4096, bias=True)
        self.drp7 = nn.Dropout(p=0.5, inplace=False)
        self.fc8 = nn.Linear(in_features=4096, out_features=2048, bias=True)
        self.drp8 = nn.Dropout(p=0.5, inplace=False)
        self.fc9 = nn.Linear(in_features=2048, out_features=1, bias=True)
        self.optimizer = optim.SGD(self.parameters(), lr=learning_rate, momentum=momentum)


        self.learning_rate = learning_rate

        wandb.init(project='convnet_tests',
        config={'learning_rate': learning_rate, 'class': 'ResMem', 'momentum': momentum, 'resnet_version': 152, 'cruise_altitude':384},
        reinit=True)

        wandb.watch(self)

    def forward(self, x):
        cnv = F.relu(self.conv1(x))
        cnv = self.pool1(cnv)
        cnv = self.lrn1(cnv)
        cnv = F.relu(self.conv2(cnv))
        cnv = self.pool2(cnv)
        cnv = self.lrn2(cnv)
        cnv = F.relu(self.conv3(cnv))
        cnv = F.relu(self.conv4(cnv))
        cnv = F.relu(self.conv5(cnv))
        cnv = self.pool5(cnv)
        feat = cnv.view(-1, 9216)
        resfeat = self.features(x)


        catfeat = cat((feat, resfeat), 1)

        hid = F.relu(self.fc6(catfeat))
        hid = self.drp6(hid)
        hid = F.relu(self.fc7(hid))
        hid = self.drp8(hid)
        hid = F.relu(self.fc8(hid))
        pry = self.fc9(hid)

        return pry
```