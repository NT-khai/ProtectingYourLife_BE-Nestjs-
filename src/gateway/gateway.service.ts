import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GatewayService {
  private readonly javaBaseUrl: string;

  constructor() {
    this.javaBaseUrl = process.env.JAVA_SERVICE_URL || 'http://localhost:3002';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.javaBaseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        let errMessage = `Lỗi từ Java microservice: ${response.statusText}`;
        try {
          const errBody = await response.json();
          errMessage = errBody.message || JSON.stringify(errBody);
        } catch {
          // Ignore json parse error
        }
        throw new HttpException(errMessage, response.status);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null as unknown as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Không thể kết nối đến Java microservice (${url}): ${(error as Error).message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // INCIDENTS
  async getIncidents() {
    return this.request('/incidents');
  }

  async getIncidentById(id: number) {
    return this.request(`/incidents/${id}`);
  }

  async getIncidentsByUserId(userId: number) {
    return this.request(`/incidents/user/${userId}`);
  }

  async createIncident(data: any) {
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIncidentStatus(id: number, status: string) {
    return this.request(`/incidents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async approveIncident(id: number) {
    return this.request(`/incidents/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async deleteIncident(id: number) {
    return this.request(`/incidents/${id}`, {
      method: 'DELETE',
    });
  }

  async getIncidentStats() {
    return this.request('/incidents/stats');
  }

  // FEEDBACKS
  async getFeedbacks() {
    return this.request('/feedbacks');
  }

  async createFeedback(data: any) {
    return this.request('/feedbacks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteFeedback(id: number) {
    return this.request(`/feedbacks/${id}`, {
      method: 'DELETE',
    });
  }

  // USERS & PROFILES
  async getAllUsers() {
    return this.request('/users');
  }

  async getUserById(id: number) {
    return this.request(`/users/${id}`);
  }

  async updateUserRole(id: number, role: string) {
    return this.request(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(id: number) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserProfile(userId: number) {
    return this.request(`/users/profile/${userId}`);
  }

  async updateUserProfile(userId: number, data: any) {
    return this.request(`/users/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}
