/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable } from '@nestjs/common';
// import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
const cheerio = require('cheerio');
// const puppeteer = require('puppeteer');
import * as fs from 'fs';
// import axios from 'axios';
import {
  chuongRegex,
  diemRegex1,
  diemRegex2,
  dieuRegex,
  isClose,
  isOpen,
  khoanRegex,
  mucRegex,
  phanRegex,
  tieuMucRegex,
} from './helper/regex';
import { Context, LawContent } from 'src/common/types';
import { Category, Field } from 'src/common/enum/enum';
import { CreateLawDto } from '../law/dto/create-law.dto';
import { LawService } from '../law/law.service';
import axios from 'axios';
import { stringToDate } from './helper';
import { hightLawList, skipLawDepartmentWord } from 'src/common/const';
import { data } from 'cheerio/dist/commonjs/api/attributes';

@Injectable()
export class CrawlerService {
  constructor(private lawService: LawService) {}

  async crawler(url: string) {
    console.log(url, Date());

    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      // userDataDir: './my-chrome-data',
      // headless: 'new',
      // slowMo: 50,
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        // '--disable-cache',
        // '--single-process',
        // '--no-zygote',
        // '--no-startup-window',
      ],
      protocolTimeout: 60000,
      executablePath:
        process.env.NODE_ENV === 'production'
          ? (process.env.PUPPETEER_EXECUTABLE_PATH ??
            '/usr/bin/chromium-browser')
          : puppeteer.executablePath(),
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      //login
      // await page.waitForSelector("#usernameTextBox");
      // await page.type("#usernameTextBox", "khtc_vietrade");
      // console.log("username");
      // await page.waitForSelector("#passwordTextBox");
      // await page.type("#passwordTextBox", "xttm2022");
      // console.log("password");
      // await page.waitForSelector("#loginButton");
      // await page.click("#loginButton");
      // console.log("login");
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // confirm login
      // const findConfirmBtns =  await page.waitForSelector(".ui-button-text");

      // console.log("confirm");
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // await page.waitForSelector('#aLuocDo', { timeout: 60000 });
      // await page.click('#aLuocDo');
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      let content = await page.content();
      if (!content) {
        throw new BadRequestException('Failed to load page content');
      }
      const $ = await cheerio.load(content);

      // const response = await axios.get(url);
      const soHieu = $("td:contains('Số hiệu:')").next().text().trim();
      const loaiVanBan = $("td:contains('Loại văn bản:')").next().text().trim();
      const coQuanBanHanh = $("td:contains('Nơi ban hành:')")
        .next()
        .text()
        .trim();

      const ngayBanHanh = $("td:contains('Ngày ban hành:')")
        .next()
        .text()
        .trim();

      const title = $('title').text().trim();
      const match = title.match(/(.+)\s+mới nhất$/);
      const tenVanBan = match ? match[1] : title;
      // const now = moment()
      //     .tz("Asia/Ho_Chi_Minh")
      //     .format("YYYY-MM-DD HH:mm:ss");

      if (!hightLawList.includes(loaiVanBan)) {
        console.log(loaiVanBan);
        await browser.close();
        return;
      }

      // if (skipLawDepartmentWord.some((word) => coQuanBanHanh.includes(word))) {
      //   console.log(coQuanBanHanh);
      //   await browser.close();
      //   return;
      // }

      const contents: LawContent = {
        header: [],
        description: [],
        mainContent: [],
        footer: [],
        extend: [],
      };

      let chapter = 0,
        muc = 0,
        part = 0; // muc: Mục, part: Phần
      let conText: Context = {
        name: '',
        value: '',
        content: [],
        tag: '', //
        internal_ner: [],
        parent_ner: [],
        aggregation_ner: [],
        embedding: '',
        reference: [],
        classification: '',
      };
      let khoan: Context = {
        name: '',
        value: '',
        content: [],
        tag: '', //
        internal_ner: [],
        parent_ner: [],
        aggregation_ner: [],
        embedding: '',
        reference: [],
        classification: '',
      };
      let diem: Context = {
        name: '',
        value: '',
        content: [],
        tag: '',
        internal_ner: [],
        parent_ner: [],
        aggregation_ner: [],
        embedding: '',
        reference: [],
        classification: '',
      };

      const checkContext = () => {
        if (conText.name !== '' || conText.content.length > 0) {
          contents.mainContent.push(conText);
          conText = {
            name: '',
            value: '',
            content: [],
            tag: '',
            internal_ner: [],
            parent_ner: [],
            aggregation_ner: [],
            embedding: '',
            reference: [],
            classification: '',
          };
        }
        return;
      };
      const checkKhoan = () => {
        if (khoan.name !== '' || khoan.content.length > 0) {
          conText.content.push(khoan);
          khoan = {
            name: '',
            value: '',
            content: [],
            tag: '',
            internal_ner: [],
            parent_ner: [],
            aggregation_ner: [],
            embedding: '',
            reference: [],
            classification: '',
          };
        }
      };
      const checkDiem = () => {
        if (diem.name !== '' || diem.content.length > 0) {
          khoan.content.push(diem);
          diem = {
            name: '',
            value: '',
            content: [],
            tag: '',
            internal_ner: [],
            parent_ner: [],
            aggregation_ner: [],
            embedding: '',
            reference: [],
            classification: '',
          };
        }
      };

      let checkPoint = 0;
      let current = 0;
      let openQuote = false;

      const readingCurrentLine = (line: string) => {
        let num;
        let matches;
        const lawContent: Context = {
          value: line,
          embedding: '',
          classification: '',
          internal_ner: [],
          reference: [],
          name: '',
          tag: '',
          parent_ner: [],
          aggregation_ner: [],
          content: [],
        };

        if (isOpen.test(line)) {
          openQuote = true;
        }
        if (openQuote) {
          if (current === 1) {
            lawContent.name = 'line' + conText.content.length;
            conText.content.push(lawContent);
          } else if (current === 2) {
            lawContent.name = 'line' + khoan.content.length;
            khoan.content.push(lawContent);
          } else if (current === 3) {
            lawContent.name = 'line' + diem.content.length;
            diem.content.push(lawContent);
          }

          if (isClose.test(line)) {
            openQuote = false;
          }
          return;
        } else if (line === '') {
          checkPoint++;
          return;
        } else if (phanRegex.test(line)) {
          part++;
          checkPoint = 2;

          current = 1;

          checkDiem();
          checkKhoan();
          checkContext();

          conText.name = 'phan' + part;
          conText.value = line;
          return;
        } else if (chuongRegex.test(line)) {
          chapter++;
          checkPoint = 2;

          current = 1;

          checkDiem();
          checkKhoan();
          checkContext();

          conText.name = 'chuong' + chapter;
          conText.value = line;
          return;
        } else if (mucRegex.test(line)) {
          muc++;
          checkPoint = 2;
          matches = line.match(mucRegex) || [];
          num = matches[1];

          current = 1;

          checkDiem();
          checkKhoan();
          checkContext();

          conText.name = 'muc' + muc;
          conText.value = line;
          conText.tag = 'chuong' + chapter;
          // lawContent.value = line.substring(matches[0].length).trim();
          lawContent.value = line;
          lawContent.name = 'line' + khoan.content.length;
          // conText.content.push(lawContent);

          return;
        } else if (tieuMucRegex.test(line)) {
          checkPoint = 2;
          matches = line.match(tieuMucRegex) || [];
          num = matches[1];

          current = 1;

          checkDiem();
          checkKhoan();
          checkContext();

          conText.name = 'tieuMuc' + num;
          conText.value = line;
          conText.tag = 'muc' + muc;
          // lawContent.value = line.substring(matches[0].length).trim();
          lawContent.value = line;
          lawContent.name = 'line' + khoan.content.length;
          // conText.content.push(lawContent);
          return;
        } else if (dieuRegex.test(line)) {
          checkPoint = 2;
          matches = line.match(dieuRegex) || [];

          num = matches[0] === 'Điều' ? matches[1] : matches[0];

          current = 1;

          checkDiem();
          checkKhoan();
          checkContext();

          conText.name = 'dieu' + num;
          conText.value = line;
          // lawContent.value = line.substring(matches[0].length).trim();
          lawContent.value = line;
          lawContent.name = 'line' + khoan.content.length;
          // conText.content.push(lawContent);

          return;
        } else if (diemRegex1.test(line) || diemRegex2.test(line)) {
          checkPoint = 2;
          matches = line.match(diemRegex1) || line.match(diemRegex2) || [];
          num = matches[1];

          current = 3;

          checkDiem();

          diem.name = 'diem' + num;
          diem.value = line;
          // lawContent.value = line.substring(matches[0].length).trim();
          lawContent.value = line;
          lawContent.name = 'line' + khoan.content.length;
          // diem.content.push(lawContent);

          return;
        } else if (khoanRegex.test(line)) {
          matches = line.match(khoanRegex) || [];
          num = matches[1];

          checkPoint = 2;
          current = 2;

          checkDiem();
          checkKhoan();

          khoan.name = 'khoan' + num;
          khoan.value = line;
          // lawContent.value = line.substring(matches[0].length).trim();
          lawContent.value = line;
          lawContent.name = 'line' + khoan.content.length;
          // khoan.content.push(lawContent);

          return;
        } else {
          if (checkPoint === 1) {
            lawContent.name = 'description' + contents.description.length;
            contents.description.push(lawContent);
          } else if (checkPoint === 2) {
            if (current === 1) {
              lawContent.name = 'line' + conText.content.length;
              conText.content.push(lawContent);
            } else if (current === 2) {
              lawContent.name = 'line' + khoan.content.length;
              khoan.content.push(lawContent);
            } else if (current === 3) {
              lawContent.name = 'line' + diem.content.length;
              diem.content.push(lawContent);
            }
          }
        }
      };

      $('#tab1 .content1 div div')
        .children()
        .each((index, element) => {
          if (element.name === 'div') {
            const $element = $(element);
            $element.children().each((i, element) => {
              if (element.name == 'table' && checkPoint < 4) {
                if (checkPoint === 0) {
                  $(element)
                    .find('p')
                    .each((i, e) => {
                      const text = $(e)
                        .text()
                        .replace(/\n/g, ' ')
                        .replace(/ +/g, ' ')
                        .replace(/-+$/g, '')
                        .trim();
                      const lawContent: Context = {
                        value: text,
                        name: 'header' + contents.header.length,
                        embedding: '',
                        classification: '',
                        internal_ner: [],
                        reference: [],
                        content: [],
                        tag: '',
                        parent_ner: [],
                        aggregation_ner: [],
                      };
                      if (text !== '') {
                        contents.header.push(lawContent);
                      }
                    });

                  // contents.header.push($(element).html());
                } else {
                  const $element = $(element); // Wrap the current element in jQuery for easier manipulation
                  const $parentChildren = $element.parent().children();
                  if (
                    $element.is($parentChildren.last()) ||
                    $element.is($parentChildren.eq(-2)) ||
                    checkPoint === 3
                  ) {
                    console.log('footer');
                    checkDiem();
                    checkKhoan();
                    checkContext();
                    $(element)
                      .find('p')
                      .each((i, e) => {
                        // $(e)
                        //     .children()
                        //     .each((i, e) => {
                        //         const text = $(e)
                        //             .text()
                        //             // .replace(/\n/g, "")
                        //             // .replace(/ +/g, " ")
                        //             .trim();
                        //         if (text !== "")
                        //             contents.footer.push(text);
                        //     });
                        const text = $(e).text().replace(/\n/g, '').trim();
                        const lawContent: Context = {
                          value: text,
                          name: 'footer' + contents.footer.length,
                          classification: '',
                          internal_ner: [],
                          embedding: '',
                          reference: [],
                          content: [],
                          tag: '',
                          parent_ner: [],
                          aggregation_ner: [],
                        };
                        if (text !== '') contents.footer.push(lawContent);
                      });
                    checkPoint++;
                  }
                  // contents.footer.push($(element).html());
                }
              } else if (checkPoint < 3) {
                const paragraph = $(element).text().replace(/\n/g, ' ').trim();
                if (paragraph !== 'Video Pháp Luật') {
                  readingCurrentLine(paragraph);
                }
              } else {
                contents.extend.push($(element).html());
              }
            });
          } else if (element.name == 'table' && checkPoint < 4) {
            if (checkPoint === 0) {
              $(element)
                .find('p')
                .each((i, e) => {
                  const text = $(e)
                    .text()
                    .replace(/\n/g, ' ')
                    .replace(/ +/g, ' ')
                    .replace(/-+$/g, '')
                    .trim();
                  const lawContent: Context = {
                    value: text,
                    name: 'header' + contents.header.length,
                    embedding: '',
                    classification: '',
                    internal_ner: [],
                    reference: [],
                    content: [],
                    tag: '',
                    parent_ner: [],
                    aggregation_ner: [],
                  };
                  if (text !== '') {
                    contents.header.push(lawContent);
                  }
                });

              // contents.header.push($(element).html());
            } else {
              const $element = $(element); // Wrap the current element in jQuery for easier manipulation
              const $parentChildren = $element.parent().children();
              if (
                $element.is($parentChildren.last()) ||
                $element.is($parentChildren.eq(-2)) ||
                checkPoint === 3
              ) {
                console.log('footer');
                checkDiem();
                checkKhoan();
                checkContext();
                $(element)
                  .find('p')
                  .each((i, e) => {
                    // $(e)
                    //     .children()
                    //     .each((i, e) => {
                    //         const text = $(e)
                    //             .text()
                    //             // .replace(/\n/g, "")
                    //             // .replace(/ +/g, " ")
                    //             .trim();
                    //         if (text !== "")
                    //             contents.footer.push(text);
                    //     });
                    const text = $(e).text().replace(/\n/g, '').trim();
                    const lawContent: Context = {
                      value: text,
                      name: 'footer' + contents.footer.length,
                      classification: '',
                      internal_ner: [],
                      embedding: '',
                      reference: [],
                      content: [],
                      tag: '',
                      parent_ner: [],
                      aggregation_ner: [],
                    };
                    if (text !== '') contents.footer.push(lawContent);
                  });
                checkPoint++;
              }
              // contents.footer.push($(element).html());
            }
          } else if (checkPoint < 3) {
            const paragraph = $(element).text().replace(/\n/g, ' ').trim();
            if (paragraph !== 'Video Pháp Luật') {
              readingCurrentLine(paragraph);
            }
          } else {
            contents.extend.push($(element).html());
          }
        });

      await page.waitForSelector('#aLuocDo', { timeout: 6000 });
      await page.click('#aLuocDo');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      content = (await page.content()) || '';

      if (!content) {
        throw new BadRequestException('Failed to load page content');
      }

      const $$ = cheerio.load(content);

      const topic = $$(
        "#tab4 #viewingDocument .att .hd.fl:contains('Lĩnh vực, ngành:')",
      )
        .next()
        .text()
        .trim();

      const law: CreateLawDto = {
        name: tenVanBan,
        category: loaiVanBan as Category,
        department: coQuanBanHanh,
        pdfUrl: url,
        baseUrl: url,
        numberDoc: soHieu,
        dateApproved: stringToDate(ngayBanHanh),
        fields: topic.split(', ') as Field[],
        content: contents,
        relationLaws: [],
      };

      // await browser.disconnect();
      await browser.close();

      if (!hightLawList.includes(law.category)) {
        console.log('law_not_hight');
        return {
          message: 'law_not_hight',
          data: law,
        };
      }

      if (contents.mainContent.length === 0) {
        await this.addError(url);
        console.log('No main content');
        return {
          message: 'No main content',
          data: law,
        };
      }
      if (contents.description.length === 0) {
        await this.addError(url);
        console.log('No description');
        return {
          message: 'No description',
          data: law,
        };
      }
      if (contents.header.length === 0) {
        await this.addError(url);
        return {
          message: 'No header',
          data: law,
        };
      }
      if (contents.footer.length === 0) {
        await this.addError(url);
        console.log('No footer');
        return {
          message: 'No footer',
          data: law,
        };
      }

      const newLaw = await this.lawService.create(law);
      if (!newLaw) {
        throw new BadRequestException('Failed to create law');
      } else {
        console.log('law_crawled');
      }
      return {
        message: 'law_crawled',
        data: newLaw,
      };
    } catch (error) {
      if (error.message.includes('duplicate')) {
        if (error.message.includes('pdfUrl'))
          throw new BadRequestException('law_pdf_existed');
        if (error.message.includes('baseUrl'))
          throw new BadRequestException('law_existed');
      }
      console.log('Error:', error.message);
    } finally {
      await browser.close();

      const dir = './my-chrome-data';
      fs.rmSync(dir, { recursive: true, force: true });
    }
    await browser.close();
  }

  async autoCrawler() {
    let isFinish = false;
    let page = 1;
    let count = 0;
    while (!isFinish) {
      const urls = await this.getUrls(page);
      if (urls.length === 0) {
        isFinish = true;
      } else {
        for (const url of urls) {
          const existed = await this.lawService.checkLawExistence(url);
          if (existed) {
            count++;
            if (count === 20) {
              isFinish = true;
              break;
            }
          } else await this.crawler(url);
        }
        page++;
      }
    }
  }

  getUrls = async (page: number) => {
    const url = `https://thuvienphapluat.vn/page/tim-van-ban.aspx?area=0&page=${page}`;
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const urls: any[] = [];
      $('.nq .nqTitle a').each((index, element) => {
        const link = $(element).attr('href');
        urls.push(link);
      });

      return urls;
    } catch (error) {
      console.error(`Error fetching URLs: ${error}`);
      return [];
    }
  };

  async crawlerAll() {
    // read file json
    const data = fs.readFileSync('./urls.json', 'utf8');
    const urls = JSON.parse(data);
    const crawled = Number(process.env.CRAWLED) || 0;
    console.log('crawled:', crawled);
    const length = urls.length;
    for (let i = crawled; i < length; i++) {
      const url = urls[i];
      const existed = await this.lawService.checkLawExistence(url);
      if (existed) {
        console.log('existed:', i);
        continue;
      } else {
        await this.crawler(url);
        process.env.CRAWLED = i.toString();
      }
    }
  }

  async addError(url: string) {
    const data = fs.readFileSync('./err.json', 'utf8');
    const urls = JSON.parse(data);
    urls.push(url);
    fs.writeFileSync('./err.json', JSON.stringify(urls), 'utf8');
  }
}
