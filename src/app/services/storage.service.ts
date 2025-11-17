// src/app/services/storage.service.ts

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Métodos genéricos de almacenamiento
  public async set(key: string, value: any): Promise<any> {
    return await this._storage?.set(key, value);
  }

  public async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  public async remove(key: string): Promise<any> {
    return await this._storage?.remove(key);
  }

  public async clear(): Promise<void> {
    return await this._storage?.clear();
  }

  public async keys(): Promise<string[]> {
    return await this._storage?.keys() || [];
  }

  public async length(): Promise<number> {
    return await this._storage?.length() || 0;
  }

  // Métodos específicos para la app
  public async getAllByPrefix(prefix: string): Promise<any[]> {
    const keys = await this.keys();
    const filteredKeys = keys.filter(key => key.startsWith(prefix));
    const promises = filteredKeys.map(key => this.get(key));
    return await Promise.all(promises);
  }

  public async removeByPrefix(prefix: string): Promise<void> {
    const keys = await this.keys();
    const filteredKeys = keys.filter(key => key.startsWith(prefix));
    const promises = filteredKeys.map(key => this.remove(key));
    await Promise.all(promises);
  }

  // Backup y restore
  public async exportData(): Promise<string> {
    const keys = await this.keys();
    const data: any = {};
    
    for (const key of keys) {
      data[key] = await this.get(key);
    }
    
    return JSON.stringify(data, null, 2);
  }

  public async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      for (const key in data) {
        await this.set(key, data[key]);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}