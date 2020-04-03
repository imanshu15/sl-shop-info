import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Details, DataModel, SocialMedia, DataList, PharmacyModel } from '../models/details.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpService: HttpService) {
  }

  public getData(): Promise<any> {
    return this.httpService.getData().toPromise();
  }

  public getData2(): Promise<any> {
    return this.httpService.getData2().toPromise();
  }

  public transformData(): Promise<any> {

    return new Promise((resolve, reject) => {
      const returnData: DataModel[] = [];

      this.getData().then(a => {
        const data = a as Details[];

        const validData = data.filter(x => x[0] !== null).slice(1);
        // tslint:disable-next-line: forin
        validData.forEach(y => {
          const temp: DataModel = new DataModel();
          temp.area = this.splitData(y[0]);
          temp.items = this.splitData(this.sentenceCase(y[1]));
          temp.vendor = this.sentenceCase(y[2]);

          const contact = this.getContacts(y[3]);
          temp.contact = contact.result;
          temp.email = contact.email;
          temp.website = contact.website;
          temp.contactComment = contact.comment;

          const socialMedia = this.getSocialMedias(y[3], y[4]);
          temp.sms = socialMedia.sms;
          temp.whatsapp = socialMedia.whatsapp;
          temp.viber = socialMedia.viber;
          temp.comments = this.sentenceCase(y[4]);
          returnData.push(temp);
        });

        resolve(returnData);
      });
    });
  }

  public transformData2(): Promise<any> {

    return new Promise((resolve, reject) => {
      const returnData: PharmacyModel[] = [];

      this.getData2().then(data => {
        const validData = data.filter(x => x.No !== null).slice(1);

        // tslint:disable-next-line: forin
        validData.forEach(y => {
          const temp: PharmacyModel = new PharmacyModel();
          temp.no = y.No;
          temp.district = y.District;
          temp.area = y['MOH Area'];
          temp.address = y.Address;
          temp.name = y['Name of the Pharmacy'];
          temp.pharmacist = y['Pharmacist Name'];
          temp.owner = y.Owner;
          temp.contactNo = y['Contact No.'];
          temp.whatsapp = y['Whatsapp No.'];
          temp.viber = y['Viber No.'];
          temp.email = y['E mail'];
          returnData.push(temp);
        });

        resolve(returnData);
      });
    });
  }

  private getContacts(contact: string): any {
    const result: string[] = [];
    const email: string[] = [];
    const website: string[] = [];
    const comment: string[] = [];
    const temp = this.splitData(contact);

    temp.forEach(x => {
      const val = this.getPhoneNumber(x);
      if (val) {
        result.push(val);
      } else if (x && this.validateEmail(x)) {
        email.push(x.toLowerCase());
      } else if (x && this.isValidUrl(x)) {
        website.push(x.toLowerCase());
      } else if (x && x.trim() !== '') {
        comment.push(x);
      }
    });

    return { result, email, website, comment };
  }

  private getPhoneNumber(phone: string) : string{
    const phoneNum = phone.replace(/[^\d]/g, '');
    if (phoneNum.length > 6 && phoneNum.length < 11) {  return phoneNum;  }
    return null;
  }

  private  validateEmail(email: string) {
    // tslint:disable-next-line: max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private isValidUrl(value: string) {
    const regexp = /^(http:\/\/www\.|https:\/\/www\.|www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/;
    return regexp.test(value.toLowerCase());
  }

  private getSocialMedias(contact: string, comment: string): SocialMedia {
    const res: SocialMedia = new SocialMedia();
    const result: string[] = [];
    const temp = this.splitData(contact);
    const temp2 = this.splitData(comment);

    temp.forEach(x => {
      result.push(x);
    });
    temp2.forEach(x => {
      result.push(x);
    });

    const sms  = result.filter(a => a.toLowerCase().includes('sms'));
    if (sms && sms.length > 0) { res.sms = true; }
    const whatsapp  = result.filter(a => a.toLowerCase().includes('whatsapp'));
    if (whatsapp && whatsapp.length > 0) { res.whatsapp = true; }
    const viber  = result.filter(a => a.toLowerCase().includes('viber'));
    if (viber && viber.length > 0) { res.whatsapp = true; }

    return res;
  }

  private splitData(str: string): string [] {

    if (str) {
      const result = str.split('/');
      if (result) {
        result.forEach(x => {
          x = this.sentenceCase(x);
        });
      }

      return result;
    } else {
      return [];
    }
  }
  private sentenceCase(str) {
    if ((str === null) || (str === '')) {
         return '';
    } else {
     str = str.toString().trim();
    }

    // tslint:disable-next-line: only-arrow-functions
    return str.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }
}

