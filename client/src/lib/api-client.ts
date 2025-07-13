import axios from 'axios'
import {HOST} from '@/utils/constants.ts'

export const apiClient = axios.create({
  baseURL: HOST
})
