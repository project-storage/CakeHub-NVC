import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private supabaseClient: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (
      !supabaseUrl ||
      !supabaseKey ||
      supabaseKey.includes('your-supabase-service-role-key')
    ) {
      this.logger.warn(
        'Supabase URL or Key is not configured correctly in environment variables. ' +
          'Supabase SDK client will not be initialized, but the database connection via Prisma is active.',
      );
      return;
    }

    try {
      this.supabaseClient = createClient(supabaseUrl, supabaseKey);
      this.logger.log('Supabase SDK client successfully initialized.');
    } catch (error) {
      this.logger.error('Failed to initialize Supabase SDK client:', error);
    }
  }

  /**
   * Get the Supabase client instance.
   * @throws Error if the client is not initialized.
   */
  getClient(): SupabaseClient {
    if (!this.supabaseClient) {
      throw new Error(
        'Supabase client is not initialized. Please verify SUPABASE_URL and SUPABASE_KEY in your .env file.',
      );
    }
    return this.supabaseClient;
  }
}
